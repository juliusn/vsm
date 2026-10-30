CREATE OR REPLACE FUNCTION public.delete_user()
  RETURNS void
  LANGUAGE sql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
	delete from auth.users where id = auth.uid();
$function$;

GRANT EXECUTE ON FUNCTION "public"."delete_user"() TO "authenticated";

REVOKE ALL ON FUNCTION "public"."delete_user"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."delete_user"() TO "postgres";

REVOKE ALL ON FUNCTION "public"."delete_user"() FROM PUBLIC, "anon", "service_role";
