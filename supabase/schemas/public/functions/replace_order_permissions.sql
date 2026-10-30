CREATE OR REPLACE FUNCTION public.replace_order_permissions (
  p_user_id              uuid,
  p_sender_business_id   character varying,
  p_receiver_business_id character varying,
  p_permissions          public.permission[]
)
  RETURNS SETOF public.order_permissions
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
BEGIN
  IF p_user_id IS NULL
     OR p_sender_business_id IS NULL
     OR p_receiver_business_id IS NULL
     OR p_permissions IS NULL
     OR pg_catalog.array_position(p_permissions, NULL) IS NOT NULL THEN
    RAISE EXCEPTION 'User, counterparties and a non-null permission array are required'
      USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Target profile not found'
      USING ERRCODE = '22023';
  END IF;

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended('permission-replacement:' || p_user_id::text, 0)
  );

  DELETE FROM public.order_permissions AS existing
  WHERE existing.user_id = p_user_id
    AND existing.sender_counterparty_business_id = p_sender_business_id
    AND existing.receiver_counterparty_business_id = p_receiver_business_id;

  INSERT INTO public.order_permissions (
    user_id, permission,
    sender_counterparty_business_id, receiver_counterparty_business_id
  )
  SELECT DISTINCT
    p_user_id, selected.permission,
    p_sender_business_id, p_receiver_business_id
  FROM pg_catalog.unnest(p_permissions) AS selected(permission);

  RETURN QUERY
  SELECT saved.* FROM public.order_permissions AS saved
  WHERE saved.user_id = p_user_id
  ORDER BY saved.sender_counterparty_business_id,
    saved.receiver_counterparty_business_id, saved.permission;
END;
$function$;

GRANT EXECUTE ON FUNCTION "public"."replace_order_permissions"(uuid, character varying, character varying, public.permission[]) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."replace_order_permissions"(uuid, character varying, character varying, public.permission[]) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."replace_order_permissions"(uuid, character varying, character varying, public.permission[]) TO "postgres";

REVOKE ALL ON FUNCTION "public"."replace_order_permissions"(uuid, character varying, character varying, public.permission[]) FROM PUBLIC, "anon", "service_role";
