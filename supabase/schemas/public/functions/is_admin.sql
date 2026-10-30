CREATE OR REPLACE FUNCTION public.is_admin()
  RETURNS boolean
  LANGUAGE sql
  STABLE
  SET search_path TO ''
  AS $function$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'admin')::boolean, false);
$function$;

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."is_admin"() TO "postgres";

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM PUBLIC, "anon", "service_role";
