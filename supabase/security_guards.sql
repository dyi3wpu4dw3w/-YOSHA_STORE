-- Apply after schema.sql and production_hardening.sql. Prevent privilege escalation through self-written profiles or stores.
create or replace function public.guard_profile_role() returns trigger language plpgsql security definer set search_path=public as $$ begin if auth.uid() is not null and not public.is_admin() then new.role:='customer'; end if; return new; end; $$;
create trigger guard_profile_role_before_write before insert or update on public.profiles for each row execute procedure public.guard_profile_role();
drop trigger if exists protect_store_status on public.stores;
create or replace function public.prevent_store_owner_status_change() returns trigger language plpgsql security definer set search_path=public as $$ begin if auth.uid() is not null and not public.is_admin() then if tg_op='INSERT' then new.status:='pending'; elsif new.status is distinct from old.status then raise exception 'Only platform administrators can change store approval status'; end if; end if; return new; end; $$;
create trigger protect_store_status before insert or update on public.stores for each row execute procedure public.prevent_store_owner_status_change();
