create table if not exists public.store_payment_settings (
 store_id uuid primary key references public.stores(id) on delete cascade,
 payment_provider text not null, account_number text not null, account_holder text not null,
 whatsapp_phone text not null, updated_at timestamptz not null default now(),
 check(length(btrim(payment_provider))>0 and length(btrim(account_number))>0 and length(btrim(account_holder))>0 and length(btrim(whatsapp_phone))>0)
);
create table if not exists public.store_delivery_zones (
 id uuid primary key default gen_random_uuid(), store_id uuid not null references public.stores(id) on delete cascade,
 state_name text not null, city_name text not null, area_name text not null,
 shipping_fee numeric(14,2) not null check(shipping_fee>=0), active boolean not null default true,
 created_at timestamptz not null default now(),
 check(length(btrim(state_name))>0 and length(btrim(city_name))>0 and length(btrim(area_name))>0)
);
create index if not exists store_delivery_zones_store_active_idx on public.store_delivery_zones(store_id,active,state_name,city_name);
alter table public.store_payment_settings enable row level security;
alter table public.store_delivery_zones enable row level security;
drop policy if exists "store payment settings customer read" on public.store_payment_settings;
create policy "store payment settings customer read" on public.store_payment_settings for select to authenticated using(true);
drop policy if exists "store payment settings seller manage" on public.store_payment_settings;
create policy "store payment settings seller manage" on public.store_payment_settings for all to authenticated using(public.owns_store(store_id) or public.is_admin()) with check(public.owns_store(store_id) or public.is_admin());
drop policy if exists "delivery zones customer read" on public.store_delivery_zones;
create policy "delivery zones customer read" on public.store_delivery_zones for select to authenticated using(active or public.owns_store(store_id) or public.is_admin());
drop policy if exists "delivery zones seller manage" on public.store_delivery_zones;
create policy "delivery zones seller manage" on public.store_delivery_zones for all to authenticated using(public.owns_store(store_id) or public.is_admin());
alter table public.orders add column if not exists merchant_payment_snapshot jsonb;
alter table public.orders add column if not exists delivery_zone_snapshot jsonb;
drop function if exists public.checkout_order(jsonb,jsonb,text,numeric);
create or replace function public.checkout_order(p_items jsonb,p_address jsonb,p_delivery_zone_id uuid)
returns uuid language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_order uuid; v_subtotal numeric(14,2):=0; v_shipping numeric(14,2); v_total numeric(14,2); v_store uuid; v_zone public.store_delivery_zones%rowtype; v_payment public.store_payment_settings%rowtype; v_product public.products%rowtype; v_item record; v_count integer:=0;
begin
 if v_user is null then raise exception 'يجب تسجيل الدخول أولاً'; end if;
 if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)=0 then raise exception 'السلة فارغة'; end if;
 if jsonb_typeof(p_address)<>'object' then raise exception 'بيانات عنوان التوصيل غير مكتملة'; end if;
 if nullif(btrim(p_address->>'recipient'),'') is null or nullif(btrim(p_address->>'phone'),'') is null or nullif(btrim(p_address->>'details'),'') is null then raise exception 'أدخل اسم المستلم ورقم الهاتف والعنوان التفصيلي'; end if;
 for v_item in select product_id,sum(quantity)::integer quantity from jsonb_to_recordset(p_items) as x(product_id uuid,quantity integer) group by product_id loop
  if v_item.product_id is null or v_item.quantity is null or v_item.quantity<1 then raise exception 'بيانات منتج غير صحيحة'; end if;
  select * into v_product from public.products where id=v_item.product_id and active=true and private.store_has_active_access(store_id) for update;
  if not found then raise exception 'أحد المنتجات غير متاح حالياً'; end if;
  if v_store is null then v_store:=v_product.store_id; elsif v_store<>v_product.store_id then raise exception 'يرجى إتمام الطلب من متجر واحد في كل مرة'; end if;
  if v_product.stock<v_item.quantity then raise exception 'الكمية غير متوفرة للمنتج %',v_product.name; end if;
  v_subtotal:=v_subtotal+(v_product.price*v_item.quantity); v_count:=v_count+1;
 end loop;
 if v_count=0 or v_store is null then raise exception 'السلة فارغة'; end if;
 select * into v_zone from public.store_delivery_zones where id=p_delivery_zone_id and store_id=v_store and active=true;
 if not found then raise exception 'منطقة التوصيل غير متاحة لدى هذا المتجر'; end if;
 select * into v_payment from public.store_payment_settings where store_id=v_store;
 if not found then raise exception 'لم يضف التاجر بيانات استقبال التحويلات بعد'; end if;
 v_shipping:=v_zone.shipping_fee; v_total:=v_subtotal+v_shipping;
 insert into public.orders(user_id,subtotal,shipping_fee,total,address_snapshot,merchant_payment_snapshot,delivery_zone_snapshot,status)
 values(v_user,v_subtotal,v_shipping,v_total,p_address||jsonb_build_object('state',v_zone.state_name,'city',v_zone.city_name,'area',v_zone.area_name),
 jsonb_build_object('provider',v_payment.payment_provider,'account_number',v_payment.account_number,'account_holder',v_payment.account_holder,'whatsapp_phone',v_payment.whatsapp_phone),
 jsonb_build_object('zone_id',v_zone.id,'state',v_zone.state_name,'city',v_zone.city_name,'area',v_zone.area_name,'shipping_fee',v_zone.shipping_fee),'pending') returning id into v_order;
 for v_item in select product_id,sum(quantity)::integer quantity from jsonb_to_recordset(p_items) as x(product_id uuid,quantity integer) group by product_id loop
  select * into v_product from public.products where id=v_item.product_id for update;
  update public.products set stock=stock-v_item.quantity where id=v_product.id;
  insert into public.order_items(order_id,product_id,store_id,product_name,unit_price,quantity,line_total) values(v_order,v_product.id,v_product.store_id,v_product.name,v_product.price,v_item.quantity,v_product.price*v_item.quantity);
 end loop;
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(v_user,'order_created_direct_to_seller','orders',v_order::text,jsonb_build_object('total',v_total,'store_id',v_store,'payment_handled_by','seller'));
 return v_order;
end; $$;
revoke all on function public.checkout_order(jsonb,jsonb,uuid) from public,anon;
grant execute on function public.checkout_order(jsonb,jsonb,uuid) to authenticated;
create or replace function public.seller_set_order_status(p_order_id uuid,p_status text)
returns void language plpgsql security definer set search_path=public as $$
begin
 if not exists(select 1 from public.order_items oi join public.stores s on s.id=oi.store_id where oi.order_id=p_order_id and s.owner_id=auth.uid()) and not public.is_admin() then raise exception 'غير مصرح لك بتعديل هذا الطلب'; end if;
 if p_status not in ('confirmed','processing','shipped','delivered','cancelled') then raise exception 'حالة الطلب غير صالحة'; end if;
 update public.orders set status=p_status::public.order_status where id=p_order_id;
 if not found then raise exception 'الطلب غير موجود'; end if;
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(auth.uid(),'seller_order_status_changed','orders',p_order_id::text,jsonb_build_object('status',p_status));
end; $$;
revoke all on function public.seller_set_order_status(uuid,text) from public,anon;
grant execute on function public.seller_set_order_status(uuid,text) to authenticated;
create or replace function public.record_order_commissions(p_order_id uuid)
returns integer language plpgsql security definer set search_path=public as $$
begin if not public.is_admin() then raise exception 'Admin access required'; end if; raise exception 'عمولات المبيعات معطلة في نموذج YOSHA الحالي؛ يتم تحصيل اشتراكات التجار فقط'; end; $$;
