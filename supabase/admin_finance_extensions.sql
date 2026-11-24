-- Commission invoices and controlled order status transitions.
alter table public.invoices add column if not exists source_order_id uuid references public.orders(id);
create unique index if not exists one_commission_invoice_per_store_order on public.invoices(store_id,source_order_id) where kind='commission' and source_order_id is not null;
create or replace function public.record_order_commissions(p_order_id uuid) returns integer
language plpgsql security definer set search_path=public as $$
declare r record; v_rate numeric(5,2); v_count integer:=0; v_store uuid; v_amount numeric(14,2);
begin
 if not public.is_admin() then raise exception 'Admin access required'; end if;
 if not exists(select 1 from public.orders where id=p_order_id and status='delivered') then raise exception 'Order must be delivered first'; end if;
 for r in select oi.* from public.order_items oi where oi.order_id=p_order_id loop
   select coalesce((select sp.commission_percent from public.seller_subscriptions ss join public.seller_plans sp on sp.id=ss.plan_id where ss.store_id=r.store_id and ss.status='active' and ss.ends_at>now() order by ss.ends_at desc limit 1),0) into v_rate;
   insert into public.commission_ledger(order_item_id,order_id,store_id,gross_amount,commission_percent,commission_amount,seller_amount)
   values(r.id,p_order_id,r.store_id,r.line_total,v_rate,round(r.line_total*v_rate/100,2),r.line_total-round(r.line_total*v_rate/100,2))
   on conflict(order_item_id) do nothing;
   if found then v_count:=v_count+1; end if;
 end loop;
 for v_store in select distinct store_id from public.order_items where order_id=p_order_id and store_id is not null loop
   select coalesce(sum(commission_amount),0) into v_amount from public.commission_ledger where order_id=p_order_id and store_id=v_store;
   if v_amount>0 then
     insert into public.invoices(store_id,source_order_id,kind,amount,currency,status,notes)
     values(v_store,p_order_id,'commission',v_amount,'SDG','unpaid','Marketplace commission for delivered order')
     on conflict do nothing;
   end if;
 end loop;
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(auth.uid(),'commissions_recorded','orders',p_order_id::text,jsonb_build_object('rows',v_count));
 return v_count;
end; $$;
revoke all on function public.record_order_commissions(uuid) from public;
grant execute on function public.record_order_commissions(uuid) to authenticated;
create or replace function public.admin_set_order_status(p_order_id uuid,p_status text) returns void
language plpgsql security definer set search_path=public as $$
declare v_status public.order_status;
begin
 if not public.is_admin() then raise exception 'Admin access required'; end if;
 if p_status not in ('pending','confirmed','processing','shipped','delivered','cancelled') then raise exception 'Invalid order status'; end if;
 v_status:=p_status::public.order_status;
 update public.orders set status=v_status where id=p_order_id;
 if not found then raise exception 'Order not found'; end if;
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(auth.uid(),'order_status_changed','orders',p_order_id::text,jsonb_build_object('status',p_status));
end; $$;
revoke all on function public.admin_set_order_status(uuid,text) from public;
grant execute on function public.admin_set_order_status(uuid,text) to authenticated;
