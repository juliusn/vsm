drop policy "Allow auth admin to read profiles" on "public"."profiles";

drop policy "Public profiles are viewable by everyone." on "public"."profiles";

drop policy "Users can insert their own profile." on "public"."profiles";

drop policy "Users can update own profile." on "public"."profiles";

alter table "public"."common_services" alter column "sort_order" drop not null;

alter table "public"."profiles" add column "is_admin" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 STABLE
AS $function$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'admin')::boolean, false);
$function$
;

CREATE OR REPLACE FUNCTION public.authorize_orders(requested_permission public.order_permission, sender_business_id character varying, receiver_business_id character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$begin

if (auth.jwt()->'app_metadata'->>'approval_status') is distinct from 'approved' then
  return false;
end if;

return exists (
  select 1
  from public.order_permissions permission
  where permission.user_id = auth.uid()
  and permission.order_permission = requested_permission
  and permission.sender_counterparty_business_id = sender_business_id
  and permission.receiver_counterparty_business_id = receiver_business_id
);
end;$function$
;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$declare
    claims jsonb;
    status public.approval_status;
    admin boolean;
  begin

    select approval_status, is_admin into status, admin from public.profiles where id = (event->>'user_id')::uuid;
    claims := event->'claims';
    
    if status is not null then
      claims := jsonb_set(claims, '{app_metadata, approval_status}', to_jsonb(status), true);
    end if;

    if admin is true then
      claims := jsonb_set(claims, '{app_metadata, admin}', 'true', true);
    end if;
  
    event := jsonb_set(event, '{claims}', claims);
    return event;
  end;$function$
;

grant update on table "public"."profiles" to "authenticated";


  create policy "Allow admin users to update profiles"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using (public.is_admin())
with check (public.is_admin());



  create policy "Allow authenticated users to read profiles"
  on "public"."profiles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow supabase_auth_admin to read profiles"
  on "public"."profiles"
  as permissive
  for select
  to supabase_auth_admin
using (true);



