-- Production hardening and atomic checkout. Apply after schema.sql.
create or replace function public.prevent_store_owner_status_change() returns trigger language plpgsql security definer set search_path=public as $$ begin if auth.uid() is not null and not public.is_admin() and new.status is distinct from old.status then raise exception 'Only platform administrators can change store approval status'; end if; return new; end; $$;
create trigger protect_store_status before update on public.stores for each row execute procedure public.prevent_store_owner_status_change();
create policy "orders admin update" on public.orders for update using(public.is_admin()) with check(public.is_admin());
create or replace function public.checkout_order(p_items jsonb,p_address jsonb,p_payment_method text,p_shipping_fee numeric default 0) returns uuid language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_order uuid; v_subtotal numeric(14,2):=0; v_total numeric(14,2); v_item record; v_product public.products%rowtype; v_payment_status public.payment_status;
begin
 if v_user is null then raise exception 'Authentication required'; end if;
 if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items)=0 then raise exception 'Cart is empty'; end if;
 if jsonb_typeof(p_address) <> 'object' then raise exception 'A delivery address is required'; end if;
 if p_payment_method not in ('cash_on_delivery','bank_transfer','bankak','mycashi','fawry') then raise exception 'Unsupported payment method'; end if;
 if p_shipping_fee < 0 then raise exception 'Invalid shipping fee'; end if;
 for v_item in select product_id, sum(quantity)::integer as quantity from jsonb_to_recordset(p_items) as x(product_id uuid, quantity integer) group by product_id loop
   if v_item.product_id is null or v_item.quantity is null or v_item.quantity < 1 then raise exception 'Invalid cart item'; end if;
   select * into v_product from public.products where id=v_item.product_id and active=true for update;
   if not found then raise exception 'A product is unavailable'; end if;
   if v_product.stock < v_item.quantity then raise exception 'Insufficient stock for %',v_product.name; end if;
   v_subtotal:=v_subtotal+(v_product.price*v_item.quantity);
 end loop;
 v_total:=v_subtotal+p_shipping_fee;
 insert into public.orders(user_id,subtotal,shipping_fee,total,address_snapshot) values(v_user,v_subtotal,p_shipping_fee,v_total,p_address) returning id into v_order;
 for v_item in select product_id, sum(quantity)::integer as quantity from jsonb_to_recordset(p_items) as x(product_id uuid, quantity integer) group by product_id loop
   select * into v_product from public.products where id=v_item.product_id and active=true for update;
   update public.products set stock=stock-v_item.quantity where id=v_product.id;
   insert into public.order_items(order_id,product_id,store_id,product_name,unit_price,quantity,line_total) values(v_order,v_product.id,v_product.store_id,v_product.name,v_product.price,v_item.quantity,v_product.price*v_item.quantity);
 end loop;
 v_payment_status:=case when p_payment_method='cash_on_delivery' then 'unpaid'::public.payment_status else 'pending_review'::public.payment_status end;
 insert into public.payments(order_id,method,status,amount) values(v_order,p_payment_method,v_payment_status,v_total);
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(v_user,'order_created','orders',v_order::text,jsonb_build_object('total',v_total,'payment_method',p_payment_method));
 return v_order;
end; $$;
revoke all on function public.checkout_order(jsonb,jsonb,text,numeric) from public;
grant execute on function public.checkout_order(jsonb,jsonb,text,numeric) to authenticated;
