CREATE OR REPLACE FUNCTION public.is_approved()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$
  SELECT coalesce(
    auth.jwt() -> 'app_metadata' ->> 'approval_status' = 'approved',
    false
  );
$function$;

GRANT EXECUTE ON FUNCTION "public"."is_approved"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."is_approved"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_approved"() TO "postgres";

REVOKE ALL ON FUNCTION "public"."is_approved"() FROM PUBLIC, "anon", "service_role";
