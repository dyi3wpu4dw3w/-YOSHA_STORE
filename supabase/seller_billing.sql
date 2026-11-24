-- Seller self-service subscription requests and invoice payment review.
alter table public.invoices add column if not exists payment_method text;
alter table public.invoices add column if not exists payment_reference text;
alter table public.invoices add column if not exists proof_url text;
drop policy if exists "subscriptions own" on public.seller_subscriptions;
create policy "subscriptions owner read" on public.seller_subscriptions for select using(public.owns_store(store_id) or public.is_admin());
create policy "subscriptions owner request" on public.seller_subscriptions for insert with check(public.owns_store(store_id) and status='pending' and starts_at is null and ends_at is null);
create or replace function public.create_subscription_invoice() returns trigger language plpgsql security definer set search_path=public as $$
declare p public.seller_plans%rowtype;
begin
 select * into p from public.seller_plans where id=new.plan_id and active=true;
 if not found then raise exception 'Plan is unavailable'; end if;
 insert into public.invoices(store_id,subscription_id,amount,currency,kind,status,due_at,notes)
 values(new.store_id,new.id,p.price,p.currency,'subscription','unpaid',now()+interval '3 days','Seller subscription invoice');
 return new;
end; $$;
drop trigger if exists subscription_invoice_on_create on public.seller_subscriptions;
create trigger subscription_invoice_on_create after insert on public.seller_subscriptions for each row execute procedure public.create_subscription_invoice();
create or replace function public.submit_invoice_payment(p_invoice_id uuid,p_method text,p_reference text,p_proof_url text default null) returns void
language plpgsql security definer set search_path=public as $$
declare v public.invoices%rowtype;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 if p_method not in ('bank_transfer','bankak','mycashi','fawry') then raise exception 'Unsupported method'; end if;
 select * into v from public.invoices where id=p_invoice_id for update;
 if not found or not public.owns_store(v.store_id) then raise exception 'Invoice not found'; end if;
 if v.status not in ('unpaid','overdue') then raise exception 'Invoice is not payable'; end if;
 if coalesce(trim(p_reference),'')='' and coalesce(trim(p_proof_url),'')='' then raise exception 'Provide a payment reference or proof'; end if;
 update public.invoices set status='pending_review',payment_method=p_method,payment_reference=p_reference,proof_url=p_proof_url where id=v.id;
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(auth.uid(),'invoice_payment_submitted','invoices',v.id::text,jsonb_build_object('method',p_method,'reference',p_reference));
end; $$;
revoke all on function public.submit_invoice_payment(uuid,text,text,text) from public;
grant execute on function public.submit_invoice_payment(uuid,text,text,text) to authenticated;
create or replace function public.admin_review_invoice(p_invoice_id uuid,p_decision text) returns void
language plpgsql security definer set search_path=public as $$
declare v public.invoices%rowtype;
begin
 if not public.is_admin() then raise exception 'Admin access required'; end if;
 if p_decision not in ('paid','void') then raise exception 'Invalid decision'; end if;
 select * into v from public.invoices where id=p_invoice_id for update;
 if not found then raise exception 'Invoice not found'; end if;
 if v.status<>'pending_review' and p_decision='paid' then raise exception 'Invoice payment is not pending review'; end if;
 update public.invoices set status=p_decision,paid_at=case when p_decision='paid' then now() else paid_at end where id=v.id;
 if p_decision='paid' and v.subscription_id is not null then
   update public.seller_subscriptions ss set starts_at=now(),ends_at=now()+make_interval(days=>sp.duration_days),status='active'
   from public.seller_plans sp where ss.id=v.subscription_id and sp.id=ss.plan_id;
   update public.stores set status='approved' where id=v.store_id;
 end if;
 insert into public.audit_logs(actor_id,action,entity,entity_id) values(auth.uid(),'invoice_'||p_decision,'invoices',v.id::text);
end; $$;
revoke all on function public.admin_review_invoice(uuid,text) from public;
grant execute on function public.admin_review_invoice(uuid,text) to authenticated;
-- Admin must verify the payment reference/proof before this RPC is called.
create or replace function public.admin_activate_subscription(p_subscription_id uuid) returns uuid
language plpgsql security definer set search_path=public as $$
declare s public.seller_subscriptions%rowtype; p public.seller_plans%rowtype; v_invoice uuid;
begin
 if not public.is_admin() then raise exception 'Admin access required'; end if;
 select * into s from public.seller_subscriptions where id=p_subscription_id for update;
 if not found then raise exception 'Subscription not found'; end if;
 select * into p from public.seller_plans where id=s.plan_id;
 if not found or not p.active then raise exception 'Plan is unavailable'; end if;
 if not exists(select 1 from public.invoices where subscription_id=s.id and status='paid') then raise exception 'Subscription invoice is not paid'; end if;
 update public.seller_subscriptions set starts_at=coalesce(starts_at,now()),ends_at=now()+make_interval(days=>p.duration_days),status='active' where id=s.id;
 update public.stores set status='approved' where id=s.store_id;
 select id into v_invoice from public.invoices where subscription_id=s.id order by created_at desc limit 1;
 insert into public.audit_logs(actor_id,action,entity,entity_id) values(auth.uid(),'subscription_activated','seller_subscriptions',s.id::text);
 return v_invoice;
end; $$;
revoke all on function public.admin_activate_subscription(uuid) from public;
grant execute on function public.admin_activate_subscription(uuid) to authenticated;
