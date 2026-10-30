CREATE OR REPLACE FUNCTION public.replace_port_event_permissions (
  p_user_id     uuid,
  p_permissions public.permission[]
)
  RETURNS SETOF public.port_event_permissions
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
BEGIN
  IF p_user_id IS NULL
     OR p_permissions IS NULL
     OR pg_catalog.array_position(p_permissions, NULL) IS NOT NULL THEN
    RAISE EXCEPTION 'User and a non-null permission array are required'
      USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Target profile not found'
      USING ERRCODE = '22023';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('permission-replacement:' || p_user_id::text, 0)
  );

  DELETE FROM public.port_event_permissions AS existing
  WHERE existing.user_id = p_user_id;

  INSERT INTO public.port_event_permissions (user_id, permission)
  SELECT DISTINCT p_user_id, selected.permission
  FROM pg_catalog.unnest(p_permissions) AS selected(permission);

  RETURN QUERY
  SELECT saved.* FROM public.port_event_permissions AS saved
  WHERE saved.user_id = p_user_id
  ORDER BY saved.permission;
END;
$function$;

GRANT EXECUTE ON FUNCTION "public"."replace_port_event_permissions"(uuid, public.permission[]) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."replace_port_event_permissions"(uuid, public.permission[]) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."replace_port_event_permissions"(uuid, public.permission[]) TO "postgres";

REVOKE ALL ON FUNCTION "public"."replace_port_event_permissions"(uuid, public.permission[]) FROM PUBLIC, "anon", "service_role";
