CREATE OR REPLACE FUNCTION public.authorize_orders (
  requested_permission public.permission,
  sender_business_id   character varying,
  receiver_business_id character varying
)
  RETURNS boolean
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$begin

if (auth.jwt()->'app_metadata'->>'approval_status') is distinct from 'approved' then
  return false;
end if;

return exists (
  select 1
  from public.order_permissions order_permission
  where order_permission.user_id = auth.uid()
  and order_permission.permission = requested_permission
  and order_permission.sender_counterparty_business_id = sender_business_id
  and order_permission.receiver_counterparty_business_id = receiver_business_id
);
end;$function$;

GRANT EXECUTE ON FUNCTION "public"."authorize_orders"(public.permission, character varying, character varying) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."authorize_orders"(public.permission, character varying, character varying) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."authorize_orders"(public.permission, character varying, character varying) TO "postgres";

REVOKE ALL ON FUNCTION "public"."authorize_orders"(public.permission, character varying, character varying) FROM PUBLIC, "anon", "service_role";
