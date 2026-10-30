CREATE OR REPLACE FUNCTION public.authorize_port_events (
  requested_permission public.permission
)
  RETURNS boolean
  LANGUAGE plpgsql
  STABLE
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
BEGIN
  IF NOT public.is_approved() THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.port_event_permissions AS p
    WHERE p.user_id = auth.uid()
      AND p.permission = requested_permission
  );
END;
$function$;

GRANT EXECUTE ON FUNCTION "public"."authorize_port_events"(public.permission) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."authorize_port_events"(public.permission) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."authorize_port_events"(public.permission) TO "postgres";

REVOKE ALL ON FUNCTION "public"."authorize_port_events"(public.permission) FROM PUBLIC, "anon", "service_role";
