drop extension if exists "pgcrypto";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize_orders(requested_permission public.app_permission, sender_business_id character varying, receiver_business_id character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
return exists (
  select 1
  from public.user_order_scopes scope
  where scope.user_id = auth.uid()
  and scope.app_permission = requested_permission
  and scope.sender_counterparty_business_id = sender_business_id
  and scope.receiver_counterparty_business_id = receiver_business_id
);
end;$function$
;

CREATE OR REPLACE FUNCTION public.orders_mark_canceled(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
update public.orders o
set order_status = 'canceled'
where o.id = p_order_id
and public.authorize_orders(
  'orders.mark_canceled',
  o.sender_counterparty_business_id,
  o.receiver_counterparty_business_id
);
if not found then
raise exception 'Not authorized';
end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.orders_mark_completed(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
update public.orders o
set order_status = 'completed'
where o.id = p_order_id
and public.authorize_orders(
  'orders.mark_completed',
  o.sender_counterparty_business_id,
  o.receiver_counterparty_business_id
);
if not found then
raise exception 'Not authorized';
end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.orders_mark_received(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
update public.orders o
set order_status = 'received'
where o.id = p_order_id
and public.authorize_orders(
  'orders.mark_received',
  o.sender_counterparty_business_id,
  o.receiver_counterparty_business_id
);
if not found then
raise exception 'Not authorized';
end if;
end;$function$
;

grant delete on table "public"."user_order_scopes" to "postgres";

grant insert on table "public"."user_order_scopes" to "postgres";

grant references on table "public"."user_order_scopes" to "postgres";

grant select on table "public"."user_order_scopes" to "postgres";

grant trigger on table "public"."user_order_scopes" to "postgres";

grant truncate on table "public"."user_order_scopes" to "postgres";

grant update on table "public"."user_order_scopes" to "postgres";


