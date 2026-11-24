-- YOSHA STORE: administration, seller billing and commission ledger.
create table if not exists public.invoices(
 id uuid primary key default gen_random_uuid(),
 invoice_number text not null unique default ('YSI-'||upper(substr(encode(gen_random_bytes(6),'hex'),1,10))),
 store_id uuid not null references public.stores(id),
 subscription_id uuid references public.seller_subscriptions(id),
 payment_id uuid references public.payments(id),
 kind text not null check(kind in ('subscription','commission','adjustment')),
 amount numeric(14,2) not null check(amount>=0),
 currency text not null default 'SDG',
 status text not null default 'unpaid' check(status in ('unpaid','pending_review','paid','void','overdue')),
 due_at timestamptz,
 paid_at timestamptz,
 notes text,
 created_at timestamptz not null default now()
);
create table if not exists public.commission_ledger(
 id uuid primary key default gen_random_uuid(),
 order_item_id uuid not null unique references public.order_items(id),
 order_id uuid not null references public.orders(id),
 store_id uuid not null references public.stores(id),
 gross_amount numeric(14,2) not null check(gross_amount>=0),
 commission_percent numeric(5,2) not null check(commission_percent between 0 and 100),
 commission_amount numeric(14,2) not null check(commission_amount>=0),
 seller_amount numeric(14,2) not null check(seller_amount>=0),
 status text not null default 'pending' check(status in ('pending','settled','reversed')),
 created_at timestamptz not null default now()
);
alter table public.invoices enable row level security;
alter table public.commission_ledger enable row level security;
drop policy if exists "invoices admin all" on public.invoices;
create policy "invoices admin all" on public.invoices for all using(public.is_admin()) with check(public.is_admin());
create policy "invoices store owner read" on public.invoices for select using(public.owns_store(store_id));
drop policy if exists "commission admin all" on public.commission_ledger;
create policy "commission admin all" on public.commission_ledger for all using(public.is_admin()) with check(public.is_admin());
create policy "commission store owner read" on public.commission_ledger for select using(public.owns_store(store_id));
-- Admins can approve/reject seller requests; approval creates a store from the submitted business name.
create or replace function public.admin_review_seller(p_application_id uuid,p_decision text) returns uuid
language plpgsql security definer set search_path=public as $$
declare a public.seller_applications%rowtype; v_store uuid; v_slug text;
begin
 if not public.is_admin() then raise exception 'Admin access required'; end if;
 if p_decision not in ('approved','rejected') then raise exception 'Invalid decision'; end if;
 select * into a from public.seller_applications where id=p_application_id for update;
 if not found then raise exception 'Application not found'; end if;
 update public.seller_applications set status=p_decision::public.seller_status,reviewed_at=now() where id=a.id;
 if p_decision='approved' then
   v_slug:=trim(both '-' from regexp_replace(lower(a.business_name),'[^a-z0-9]+','-','g'));
   if v_slug='' then v_slug:='store-'||substr(a.id::text,1,8); end if;
   v_slug:=v_slug||'-'||substr(a.id::text,1,6);
   insert into public.stores(owner_id,name,slug,description,status) values(a.user_id,a.business_name,v_slug,a.description,'approved') returning id into v_store;
   update public.profiles set role='seller' where id=a.user_id;
 end if;
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(auth.uid(),'seller_application_'||p_decision,'seller_applications',a.id::text,jsonb_build_object('business_name',a.business_name));
 return v_store;
end; $$;
revoke all on function public.admin_review_seller(uuid,text) from public;
grant execute on function public.admin_review_seller(uuid,text) to authenticated;
-- Subscription approval creates an invoice; activation is performed only after an admin confirms payment.
create or replace function public.admin_activate_subscription(p_subscription_id uuid) returns uuid
language plpgsql security definer set search_path=public as $$
declare s public.seller_subscriptions%rowtype; p public.seller_plans%rowtype; v_invoice uuid;
begin
 if not public.is_admin() then raise exception 'Admin access required'; end if;
 select * into s from public.seller_subscriptions where id=p_subscription_id for update;
 if not found then raise exception 'Subscription not found'; end if;
 select * into p from public.seller_plans where id=s.plan_id;
 if not found or not p.active then raise exception 'Plan is unavailable'; end if;
 if s.payment_id is not null and not exists(select 1 from public.payments where id=s.payment_id and status='paid') then raise exception 'Subscription payment is not verified'; end if;
 update public.seller_subscriptions set starts_at=coalesce(starts_at,now()),ends_at=now()+make_interval(days=>p.duration_days),status='active' where id=s.id;
 update public.stores set status='approved' where id=s.store_id;
 insert into public.invoices(store_id,subscription_id,amount,currency,kind,status,due_at,notes)
 values(s.store_id,s.id,p.price,p.currency,'subscription','paid',now(),'Subscription activated by platform administrator')
 returning id into v_invoice;
 update public.invoices set paid_at=now() where id=v_invoice;
 insert into public.audit_logs(actor_id,action,entity,entity_id) values(auth.uid(),'subscription_activated','seller_subscriptions',s.id::text);
 return v_invoice;
end; $$;
revoke all on function public.admin_activate_subscription(uuid) from public;
grant execute on function public.admin_activate_subscription(uuid) to authenticated;
-- Create commission rows once an order is delivered. Uses the store's current active plan rate, defaulting to zero.
create or replace function public.record_order_commissions(p_order_id uuid) returns integer
language plpgsql security definer set search_path=public as $$
declare r record; v_rate numeric(5,2); v_count integer:=0;
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
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(auth.uid(),'commissions_recorded','orders',p_order_id::text,jsonb_build_object('rows',v_count));
 return v_count;
end; $$;
revoke all on function public.record_order_commissions(uuid) from public;
grant execute on function public.record_order_commissions(uuid) to authenticated;
create or replace function public.admin_verify_payment(p_payment_id uuid,p_decision text) returns void
language plpgsql security definer set search_path=public as $$
declare p public.payments%rowtype;
begin
 if not public.is_admin() then raise exception 'Admin access required'; end if;
 if p_decision not in ('paid','failed','refunded') then raise exception 'Invalid payment decision'; end if;
 select * into p from public.payments where id=p_payment_id for update;
 if not found then raise exception 'Payment not found'; end if;
 update public.payments set status=p_decision::public.payment_status,verified_by=auth.uid(),verified_at=now() where id=p.id;
 update public.invoices set status=case when p_decision='paid' then 'paid' else status end,paid_at=case when p_decision='paid' then now() else paid_at end,payment_id=p.id where payment_id=p.id;
 insert into public.audit_logs(actor_id,action,entity,entity_id) values(auth.uid(),'payment_'||p_decision,'payments',p.id::text);
end; $$;
revoke all on function public.admin_verify_payment(uuid,text) from public;
grant execute on function public.admin_verify_payment(uuid,text) to authenticated;
