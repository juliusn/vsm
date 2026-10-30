SET local check_function_bodies = off;

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "anon";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "authenticated";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON SEQUENCES FROM "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON FUNCTIONS FROM "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL ON TABLES FROM "service_role";

REVOKE ALL ON FUNCTION "public"."authorize_orders"(public.permission, character varying, character varying) FROM "service_role";

REVOKE ALL ON FUNCTION "public"."authorize_port_events"(public.permission) FROM "service_role";

REVOKE ALL ON FUNCTION "public"."create_order"(character varying, character varying, uuid, uuid[]) FROM "service_role";

REVOKE ALL ON FUNCTION "public"."custom_access_token_hook"(jsonb) FROM "service_role";

REVOKE ALL ON FUNCTION "public"."delete_user"() FROM "service_role";

REVOKE ALL ON FUNCTION "public"."edit_order"(uuid, character varying, character varying, uuid, uuid[]) FROM "service_role";

REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM "service_role";

REVOKE ALL ON FUNCTION "public"."install_available_extensions_and_test"() FROM "service_role";

REVOKE ALL ON FUNCTION "public"."is_admin"() FROM "service_role";

REVOKE ALL ON FUNCTION "public"."is_approved"() FROM "service_role";

REVOKE ALL ON FUNCTION "public"."replace_order_permissions"(uuid, character varying, character varying, public.permission[]) FROM "service_role";

REVOKE ALL ON FUNCTION "public"."replace_port_event_permissions"(uuid, public.permission[]) FROM "service_role";

REVOKE ALL ON FUNCTION "public"."set_berth_service_sort_order"() FROM "service_role";

REVOKE ALL ON FUNCTION "public"."set_sort_order"() FROM "service_role";

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
  RETURNS event_trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO 'pg_catalog'
  AS $function$
DECLARE
  cmd record;
  tbl name;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        SELECT c.relname INTO tbl FROM pg_catalog.pg_class c WHERE c.oid = cmd.objid;
        EXECUTE format('alter table if exists %I.%I enable row level security', cmd.schema_name, tbl);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$;

REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM PUBLIC, "anon", "authenticated", "service_role";

CREATE EVENT TRIGGER "ensure_rls"
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION "public"."rls_auto_enable"();

REVOKE ALL ON FUNCTION "public"."rls_auto_enable"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."rls_auto_enable"() TO "postgres";

REVOKE ALL ON TABLE "public"."port_event_permissions" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."port_event_permissions" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLES TO "service_role";

