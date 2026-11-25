-- Atomically create a pending store and seller application.
create or replace function public.create_seller_application(p_business_name text,p_phone text,p_description text)
returns jsonb language plpgsql security definer set search_path=public as $$
declare v_user uuid:=auth.uid(); v_application uuid; v_store uuid; v_slug text; v_base text;
begin
 if v_user is null then raise exception 'يجب تسجيل الدخول أولاً'; end if;
 if nullif(btrim(p_business_name),'') is null then raise exception 'اكتب اسم المتجر'; end if;
 if nullif(btrim(p_phone),'') is null then raise exception 'اكتب رقم التواصل'; end if;
 if nullif(btrim(p_description),'') is null then raise exception 'اكتب وصف المتجر'; end if;
 if exists(select 1 from public.stores where owner_id=v_user and status in ('pending','approved','suspended')) then raise exception 'لديك متجر مسجل بالفعل أو طلب قيد المراجعة'; end if;
 if exists(select 1 from public.seller_applications where user_id=v_user and status='pending') then raise exception 'لديك طلب إنشاء متجر قيد المراجعة بالفعل'; end if;
 insert into public.seller_applications(user_id,business_name,phone,description,status) values(v_user,btrim(p_business_name),btrim(p_phone),btrim(p_description),'pending') returning id into v_application;
 v_base:=trim(both '-' from regexp_replace(lower(btrim(p_business_name)),'[^a-z0-9]+','-','g'));
 if v_base='' then v_base:='store'; end if;
 v_slug:=left(v_base,42)||'-'||substr(v_application::text,1,6);
 insert into public.stores(owner_id,name,slug,description,status) values(v_user,btrim(p_business_name),v_slug,btrim(p_description),'pending') returning id into v_store;
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(v_user,'seller_application_created','seller_applications',v_application::text,jsonb_build_object('store_id',v_store,'business_name',btrim(p_business_name)));
 return jsonb_build_object('application_id',v_application,'store_id',v_store,'status','pending');
end; $$;
revoke all on function public.create_seller_application(text,text,text) from public,anon;
grant execute on function public.create_seller_application(text,text,text) to authenticated;

create or replace function public.admin_review_seller(p_application_id uuid,p_decision text)
returns uuid language plpgsql security definer set search_path=public as $$
declare a public.seller_applications%rowtype; v_store uuid; v_slug text;
begin
 if not public.is_admin() then raise exception 'Admin access required'; end if;
 if p_decision not in ('approved','rejected') then raise exception 'Invalid decision'; end if;
 select * into a from public.seller_applications where id=p_application_id for update;
 if not found then raise exception 'Application not found'; end if;
 select id into v_store from public.stores where owner_id=a.user_id and slug like '%-'||substr(a.id::text,1,6) order by created_at desc limit 1;
 if p_decision='approved' then
  if v_store is null then
   v_slug:=trim(both '-' from regexp_replace(lower(a.business_name),'[^a-z0-9]+','-','g'));
   if v_slug='' then v_slug:='store'; end if;
   v_slug:=left(v_slug,42)||'-'||substr(a.id::text,1,6);
   insert into public.stores(owner_id,name,slug,description,status,trial_ends_at) values(a.user_id,a.business_name,v_slug,a.description,'approved',now()+interval '3 days') returning id into v_store;
  else update public.stores set status='approved',trial_ends_at=coalesce(trial_ends_at,now()+interval '3 days') where id=v_store; end if;
  update public.profiles set role='seller' where id=a.user_id;
  update public.seller_applications set status='approved',reviewed_at=now() where id=a.id;
 else
  if v_store is not null then update public.stores set status='rejected' where id=v_store; end if;
  update public.seller_applications set status='rejected',reviewed_at=now() where id=a.id;
 end if;
 insert into public.audit_logs(actor_id,action,entity,entity_id,metadata) values(auth.uid(),'seller_application_'||p_decision,'seller_applications',a.id::text,jsonb_build_object('business_name',a.business_name,'store_id',v_store,'trial_days',case when p_decision='approved' then 3 else 0 end));
 return v_store;
end; $$;
revoke all on function public.admin_review_seller(uuid,text) from public,anon;
grant execute on function public.admin_review_seller(uuid,text) to authenticated;