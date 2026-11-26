alter table public.stores
  add column if not exists deleted_at timestamptz;

create or replace function public.admin_delete_empty_store(p_store_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_store_id uuid;
  v_product_count bigint;
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception 'غير مصرح لك بحذف المتاجر';
  end if;

  select id into v_store_id
  from public.stores
  where id = p_store_id
  for update;

  if v_store_id is null then
    raise exception 'المتجر غير موجود';
  end if;

  select count(*) into v_product_count
  from public.products
  where store_id = p_store_id;

  if v_product_count > 0 then
    raise exception 'لا يمكن حذف المتجر لأنه يحتوي على منشورات. احذف أو انقل المنتجات أولاً.';
  end if;

  update public.stores
  set status = 'suspended'::public.seller_status,
      deleted_at = now()
  where id = p_store_id
    and deleted_at is null;

  if not found then
    raise exception 'المتجر محذوف مسبقاً';
  end if;
end;
$$;

revoke all on function public.admin_delete_empty_store(uuid) from public;
grant execute on function public.admin_delete_empty_store(uuid) to authenticated;
