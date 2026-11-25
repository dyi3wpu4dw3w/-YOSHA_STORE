-- YOSHA profile and seller identity settings.
alter table public.profiles add column if not exists avatar_url text;

-- Let users update their own profile fields without changing their role.
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Preserve the assigned role on updates; only new signups default to customer.
create or replace function public.guard_profile_role()
returns trigger language plpgsql security definer set search_path=public
as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.role := 'customer';
    else
      new.role := old.role;
    end if;
  end if;
  return new;
end;
$$;

-- Public image URLs; uploads are restricted to the authenticated user's folder.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-media','profile-media',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true, file_size_limit=5242880,
  allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "profile media public read" on storage.objects;
create policy "profile media public read" on storage.objects
for select using (bucket_id = 'profile-media');

drop policy if exists "profile media owner insert" on storage.objects;
create policy "profile media owner insert" on storage.objects
for insert to authenticated
with check (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "profile media owner update" on storage.objects;
create policy "profile media owner update" on storage.objects
for update to authenticated
using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "profile media owner delete" on storage.objects;
create policy "profile media owner delete" on storage.objects
for delete to authenticated
using (bucket_id = 'profile-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
