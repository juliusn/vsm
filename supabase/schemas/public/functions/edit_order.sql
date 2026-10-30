CREATE OR REPLACE FUNCTION public.edit_order (
  p_order_id             uuid,
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
  existing_order public.orders%ROWTYPE;
BEGIN
  SELECT * INTO existing_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found or editing is not authorized' USING ERRCODE = '42501';
  END IF;
  IF public.authorize_orders('edit', existing_order.sender_counterparty_business_id,
       existing_order.receiver_counterparty_business_id) IS DISTINCT FROM true
     OR public.authorize_orders('edit', p_sender_business_id, p_receiver_business_id) IS DISTINCT FROM true THEN
    RAISE EXCEPTION 'Order not found or editing is not authorized' USING ERRCODE = '42501';
  END IF;
  IF p_berthing IS NULL OR p_service_ids IS NULL
     OR cardinality(p_service_ids) = 0 OR array_position(p_service_ids, NULL) IS NOT NULL THEN
    RAISE EXCEPTION 'A berthing and at least one non-null service are required' USING ERRCODE = '22023';
  END IF;

  UPDATE public.orders SET
    sender_counterparty_business_id = p_sender_business_id,
    receiver_counterparty_business_id = p_receiver_business_id,
    berthing = p_berthing
  WHERE id = p_order_id;

  DELETE FROM public.common_service_order
  WHERE "order" = p_order_id AND NOT (common_service = ANY(p_service_ids));
  INSERT INTO public.common_service_order ("order", common_service)
  SELECT p_order_id, service_id FROM (SELECT DISTINCT unnest(p_service_ids) AS service_id) AS selected
  ON CONFLICT ("order", common_service) DO NOTHING;

  RETURN p_order_id;
END;
$function$;

GRANT EXECUTE ON FUNCTION "public"."edit_order"(uuid, character varying, character varying, uuid, uuid[]) TO "authenticated";

REVOKE ALL ON FUNCTION "public"."edit_order"(uuid, character varying, character varying, uuid, uuid[]) FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."edit_order"(uuid, character varying, character varying, uuid, uuid[]) TO "postgres";

REVOKE ALL ON FUNCTION "public"."edit_order"(uuid, character varying, character varying, uuid, uuid[]) FROM PUBLIC, "anon", "service_role";
