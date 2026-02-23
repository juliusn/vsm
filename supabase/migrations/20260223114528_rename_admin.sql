alter table "public"."profiles" drop column "is_admin";

alter table "public"."profiles" add column "admin" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$declare
    claims jsonb;
    p_status public.approval_status;
    p_admin boolean;
  begin

    select approval_status, admin into p_status, p_admin from public.profiles where id = (event->>'user_id')::uuid;
    claims := event->'claims';
    
    if p_status is not null then
      claims := jsonb_set(claims, '{app_metadata, approval_status}', to_jsonb(p_status), true);
    end if;

    if p_admin is true then
      claims := jsonb_set(claims, '{app_metadata, admin}', 'true', true);
    end if;
  
    event := jsonb_set(event, '{claims}', claims);
    return event;
  end;$function$
;


