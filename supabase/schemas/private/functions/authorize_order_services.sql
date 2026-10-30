CREATE OR REPLACE FUNCTION private.authorize_order_services (
  p_order_id   uuid,
  p_permission public.permission
)
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.orders AS parent
    WHERE parent.id = p_order_id
      AND public.authorize_orders(p_permission,
        parent.sender_counterparty_business_id, parent.receiver_counterparty_business_id)
  );
$function$;

GRANT EXECUTE ON FUNCTION "private"."authorize_order_services"(uuid, public.permission) TO "authenticated";

REVOKE ALL ON FUNCTION "private"."authorize_order_services"(uuid, public.permission) FROM PUBLIC;

REVOKE ALL ON FUNCTION "private"."authorize_order_services"(uuid, public.permission) FROM "postgres";

GRANT EXECUTE ON FUNCTION "private"."authorize_order_services"(uuid, public.permission) TO "postgres";
