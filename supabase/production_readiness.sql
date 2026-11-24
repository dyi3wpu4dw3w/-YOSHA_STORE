-- YOSHA STORE production-readiness patch (apply after admin_finance_extensions.sql).
-- Safe to re-run: all schema changes are additive or replace named policies/functions.

-- The UI sorts subscriptions by created_at; the original core schema omitted it.
alter table public.seller_subscriptions
  add column if not exists created_at timestamptz not null default now();
alter table public.seller_plans
  add column if not exists created_at timestamptz not null default now();

create index if not exists seller_plans_created_idx on public.seller_plans(created_at desc);
create index if not exists seller_subscriptions_store_created_idx
  on public.seller_subscriptions(store_id, created_at desc);
create index if not exists invoices_store_created_idx
  on public.invoices(store_id, created_at desc);
create index if not exists order_items_store_order_idx
  on public.order_items(store_id, order_id);
create index if not exists products_active_created_idx
  on public.products(active, created_at desc);

-- Public catalog must never expose products belonging to unapproved/suspended stores.
drop policy if exists "products public active" on public.products;
create policy "products public active" on public.products
  for select using (
    (active and exists (
      select 1 from public.stores st
      where st.id = products.store_id and st.status = 'approved'
    ))
    or public.owns_store(store_id)
    or public.is_admin()
  );

-- Sellers may manage catalog only after the platform has approved their store.
drop policy if exists "products seller manage" on public.products;
create policy "products seller manage" on public.products
  for all using (
    public.is_admin()
    or (public.owns_store(store_id) and exists (
      select 1 from public.stores st
      where st.id = products.store_id and st.status = 'approved'
    ))
  ) with check (
    public.is_admin()
    or (public.owns_store(store_id) and exists (
      select 1 from public.stores st
      where st.id = products.store_id and st.status = 'approved'
    ))
  );

-- Use a SECURITY DEFINER helper to avoid an orders <-> order_items RLS policy cycle.
create or replace function public.seller_can_read_order(p_order_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.order_items oi
    join public.stores st on st.id = oi.store_id
    where oi.order_id = p_order_id and st.owner_id = auth.uid()
  );
$$;
revoke all on function public.seller_can_read_order(uuid) from public;
grant execute on function public.seller_can_read_order(uuid) to authenticated;

-- Seller dashboard can read only orders containing that seller's items.
drop policy if exists "orders seller read" on public.orders;
create policy "orders seller read" on public.orders
  for select using (public.is_admin() or public.seller_can_read_order(id));

-- All customer checkout writes must go through the atomic, stock-checking RPC.
-- SECURITY DEFINER checkout_order remains the sole customer write path.
drop policy if exists "orders customer create" on public.orders;
drop policy if exists "order items create via owner" on public.order_items;
drop policy if exists "payments own create" on public.payments;

-- Prevent repeated approval clicks from creating duplicate stores for one application.
create or replace function public.admin_review_seller(
  p_application_id uuid,
  p_decision text
) returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  a public.seller_applications%rowtype;
  v_store uuid;
  v_slug text;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if p_decision not in ('approved','rejected') then raise exception 'Invalid decision'; end if;
  select * into a from public.seller_applications where id = p_application_id for update;
  if not found then raise exception 'Application not found'; end if;

  select id into v_store from public.stores where owner_id = a.user_id
    and slug like '%-' || substr(a.id::text,1,6) limit 1;

  if p_decision = 'approved' then
    if v_store is null then
      v_slug := trim(both '-' from regexp_replace(lower(a.business_name),'[^a-z0-9]+','-','g'));
      if v_slug = '' then v_slug := 'store-' || substr(a.id::text,1,8); end if;
      v_slug := v_slug || '-' || substr(a.id::text,1,6);
      insert into public.stores(owner_id,name,slug,description,status)
      values(a.user_id,a.business_name,v_slug,a.description,'approved')
      returning id into v_store;
    else
      update public.stores set status='approved' where id=v_store;
    end if;
    update public.profiles set role='seller' where id=a.user_id;
    update public.seller_applications set status='approved', reviewed_at=now() where id=a.id;
  else
    update public.seller_applications set status='rejected', reviewed_at=now() where id=a.id;
  end if;

  insert into public.audit_logs(actor_id,action,entity,entity_id,metadata)
  values(auth.uid(),'seller_application_'||p_decision,'seller_applications',a.id::text,
    jsonb_build_object('business_name',a.business_name,'store_id',v_store));
  return v_store;
end;
$$;
revoke all on function public.admin_review_seller(uuid,text) from public;
grant execute on function public.admin_review_seller(uuid,text) to authenticated;

-- Explicit privileges for the customer-facing atomic checkout routine.
revoke all on function public.checkout_order(jsonb,jsonb,text,numeric) from public, anon;
grant execute on function public.checkout_order(jsonb,jsonb,text,numeric) to authenticated;

-- Keep product and seller order access behind RLS; no service-role key belongs in the browser.
