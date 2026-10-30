CREATE OR REPLACE FUNCTION public.create_order (
  p_sender_business_id   character varying,
  p_receiver_business_id character varying,
  p_berthing             uuid,
  p_service_ids          uuid[]
)
  RETURNS uuid
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path TO ''
  AS $function$
DECLARE
  new_order_id uuid;
BEGIN
  IF public.authorize_orders('create', p_sender_business_id, p_receiver_business_id) IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Order creation is not authorized' USING ERRCODE = '42501';
  END IF;
  IF p_berthing IS NULL OR p_service_ids IS NULL
     OR cardinality(p_service_ids) = 0 OR array_position(p_service_ids, NULL) IS NOT NULL THEN
    RAISE EXCEPTION 'A berthing and at least one non-null service are required' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.orders (sender_counterparty_business_id, receiver_counterparty_business_id, berthing, status)
  VALUES (p_sender_business_id, p_receiver_business_id, p_berthing, 'submitted')
  RETURNING id INTO new_order_id;

  INSERT INTO public.common_service_order ("order", common_service)
  SELECT new_order_id, service_id FROM (SELECT DISTINCT unnest(p_service_ids) AS service_id) AS selected;

  RETURN new_order_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION "public"."create_order"(character varying, character varying, uuid, uuid[]) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."create_order"(character varying, character varying, uuid, uuid[]) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."create_order"(character varying, character varying, uuid, uuid[]) TO "postgres";

REVOKE ALL ON FUNCTION "public"."create_order"(character varying, character varying, uuid, uuid[]) FROM PUBLIC, "anon", "service_role";
