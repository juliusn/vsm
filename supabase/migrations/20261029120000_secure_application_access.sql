-- Extend scoped order permissions to port events and secure application access.
ALTER TYPE public.order_permission RENAME TO permission;
ALTER TABLE public.order_permissions RENAME COLUMN order_permission TO permission;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.assignments ALTER COLUMN id DROP IDENTITY;
ALTER TABLE public.assignments ALTER COLUMN id TYPE uuid USING gen_random_uuid();
ALTER TABLE public.assignments ALTER COLUMN id SET DEFAULT gen_random_uuid();

CREATE TABLE public.port_event_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission public.permission NOT NULL,
  CONSTRAINT port_event_permissions_user_permission_key UNIQUE (user_id, permission)
);
ALTER TABLE public.port_event_permissions ENABLE ROW LEVEL SECURITY;

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

CREATE OR REPLACE FUNCTION public.authorize_orders(requested_permission public.permission, sender_business_id character varying, receiver_business_id character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$begin

if (auth.jwt()->'app_metadata'->>'approval_status') is distinct from 'approved' then
  return false;
end if;

return exists (
  select 1
  from public.order_permissions order_permission
  where order_permission.user_id = auth.uid()
  and order_permission.permission = requested_permission
  and order_permission.sender_counterparty_business_id = sender_business_id
  and order_permission.receiver_counterparty_business_id = receiver_business_id
);
end;$function$;

CREATE OR REPLACE FUNCTION public.authorize_port_events(requested_permission public.permission)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION public.replace_order_permissions(p_user_id uuid, p_sender_business_id character varying, p_receiver_business_id character varying, p_permissions public.permission[])
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

CREATE OR REPLACE FUNCTION public.replace_port_event_permissions(p_user_id uuid, p_permissions public.permission[])
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


DROP POLICY "Allow admin users to do anything" ON public.order_permissions;
CREATE POLICY "Allow approved admin users to do anything" ON public.order_permissions
  FOR ALL TO authenticated
  USING ((public.is_admin() AND public.is_approved()))
  WITH CHECK ((public.is_admin() AND public.is_approved()));

CREATE POLICY "Allow approved admin users to do anything" ON public.port_event_permissions
  FOR ALL TO authenticated
  USING ((public.is_admin() AND public.is_approved()))
  WITH CHECK ((public.is_admin() AND public.is_approved()));
CREATE POLICY "Allow users to view their own data" ON public.port_event_permissions
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = user_id);

DROP POLICY "Allow authenticated users to read profiles" ON public.profiles;
CREATE POLICY "Allow approved users to read profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_approved());
CREATE POLICY "Users can read their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = (SELECT auth.uid()));

-- Reference data is shared by approved users and maintained by approved admins.
DO $migration$
DECLARE
  target_table text;
  existing_policy record;
BEGIN
  FOREACH target_table IN ARRAY ARRAY[
    'locations', 'port_areas', 'berths', 'metadata',
    'berth_services', 'berth_service_translations',
    'common_services', 'common_service_translations',
    'counterparties', 'counterparty_translations'
  ] LOOP
    FOR existing_policy IN
      SELECT policyname FROM pg_catalog.pg_policies
      WHERE schemaname = 'public' AND tablename = target_table
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', existing_policy.policyname, target_table);
    END LOOP;
    EXECUTE format('CREATE POLICY "Approved users can read" ON public.%I FOR SELECT TO authenticated USING ((SELECT public.is_approved()))', target_table);
    EXECUTE format('CREATE POLICY "Approved admins can create" ON public.%I FOR INSERT TO authenticated WITH CHECK ((SELECT public.is_approved() AND public.is_admin()))', target_table);
    EXECUTE format('CREATE POLICY "Approved admins can edit" ON public.%I FOR UPDATE TO authenticated USING ((SELECT public.is_approved() AND public.is_admin())) WITH CHECK ((SELECT public.is_approved() AND public.is_admin()))', target_table);
    EXECUTE format('CREATE POLICY "Approved admins can delete" ON public.%I FOR DELETE TO authenticated USING ((SELECT public.is_approved() AND public.is_admin()))', target_table);
  END LOOP;
END;
$migration$;

ALTER POLICY "Allow admin users to update profiles" ON public.profiles
  USING ((SELECT public.is_approved() AND public.is_admin()))
  WITH CHECK ((SELECT public.is_approved() AND public.is_admin()));

-- Operational tables share the port-event action permissions.
DO $migration$
DECLARE
  target_table text;
  existing_policy record;
BEGIN
  FOREACH target_table IN ARRAY ARRAY['port_events', 'berthings', 'berthing_shiftings'] LOOP
    FOR existing_policy IN
      SELECT policyname FROM pg_catalog.pg_policies
      WHERE schemaname = 'public' AND tablename = target_table
    LOOP
      EXECUTE format('DROP POLICY %I ON public.%I', existing_policy.policyname, target_table);
    END LOOP;
    EXECUTE format('CREATE POLICY "Authorize create" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.authorize_port_events(''create''))', target_table);
    EXECUTE format('CREATE POLICY "Authorize delete" ON public.%I FOR DELETE TO authenticated USING (public.authorize_port_events(''delete''))', target_table);
    EXECUTE format('CREATE POLICY "Authorize edit" ON public.%I FOR UPDATE TO authenticated USING (public.authorize_port_events(''edit'')) WITH CHECK ((SELECT public.authorize_port_events(''edit'')))', target_table);
    EXECUTE format('CREATE POLICY "Authorize read" ON public.%I FOR SELECT TO authenticated USING (public.authorize_port_events(''read''))', target_table);
  END LOOP;
END;
$migration$;

CREATE POLICY "Authorize read" ON public.assignments
  FOR SELECT TO authenticated USING ((SELECT public.authorize_port_events('read')));
CREATE POLICY "Authorize create" ON public.assignments
  FOR INSERT TO authenticated WITH CHECK ((SELECT public.authorize_port_events('edit')));
CREATE POLICY "Authorize edit" ON public.assignments
  FOR UPDATE TO authenticated
  USING ((SELECT public.authorize_port_events('edit')))
  WITH CHECK ((SELECT public.authorize_port_events('edit')));
CREATE POLICY "Authorize delete" ON public.assignments
  FOR DELETE TO authenticated USING ((SELECT public.authorize_port_events('edit')));

-- A private helper checks the parent scope without depending on its SELECT policy.
CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;
CREATE FUNCTION private.authorize_order_services(p_order_id uuid, p_permission public.permission)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.orders AS parent
    WHERE parent.id = p_order_id
      AND public.authorize_orders(p_permission,
        parent.sender_counterparty_business_id, parent.receiver_counterparty_business_id)
  );
$function$;
REVOKE ALL ON FUNCTION private.authorize_order_services(uuid, public.permission) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION private.authorize_order_services(uuid, public.permission) TO authenticated;

DROP POLICY "Enable all for authenticated users only" ON public.common_service_order;
CREATE POLICY "Authorize read" ON public.common_service_order
  FOR SELECT TO authenticated USING (private.authorize_order_services("order", 'read'));
CREATE POLICY "Authorize create" ON public.common_service_order
  FOR INSERT TO authenticated WITH CHECK (private.authorize_order_services("order", 'edit'));
CREATE POLICY "Authorize delete" ON public.common_service_order
  FOR DELETE TO authenticated USING (private.authorize_order_services("order", 'edit'));
-- There is deliberately no UPDATE policy: links are inserted or deleted.

CREATE FUNCTION public.create_order(
  p_sender_business_id character varying,
  p_receiver_business_id character varying,
  p_berthing uuid,
  p_service_ids uuid[]
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
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

CREATE FUNCTION public.edit_order(
  p_order_id uuid,
  p_sender_business_id character varying,
  p_receiver_business_id character varying,
  p_berthing uuid,
  p_service_ids uuid[]
)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = ''
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

-- Client roles only need row operations; RLS does not protect TRUNCATE.
DO $migration$
DECLARE target_table record;
BEGIN
  FOR target_table IN SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC, anon, authenticated', target_table.tablename);
    IF target_table.tablename = 'profiles' THEN
      GRANT SELECT, UPDATE ON public.profiles TO authenticated;
    ELSIF target_table.tablename = 'common_service_order' THEN
      GRANT SELECT, INSERT, DELETE ON public.common_service_order TO authenticated;
    ELSE
      EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO authenticated', target_table.tablename);
    END IF;
  END LOOP;
END;
$migration$;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE ALL ON TABLES FROM PUBLIC, anon, authenticated;
-- PostgreSQL's built-in PUBLIC function privilege is global; a schema-level
-- revoke alone cannot remove it. New functions must grant execution explicitly.
ALTER DEFAULT PRIVILEGES FOR ROLE postgres
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM anon, authenticated;

-- Review every application function explicitly; leave extension functions alone.
DO $migration$
DECLARE application_function record;
BEGIN
  FOR application_function IN
    SELECT p.oid::regprocedure AS signature FROM pg_catalog.pg_proc p
    JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND NOT EXISTS (
      SELECT 1 FROM pg_catalog.pg_depend d
      WHERE d.classid = 'pg_catalog.pg_proc'::regclass AND d.objid = p.oid AND d.deptype = 'e'
    )
  LOOP
    EXECUTE format('REVOKE ALL ON FUNCTION %s FROM PUBLIC, anon, authenticated', application_function.signature);
  END LOOP;
END;
$migration$;
GRANT EXECUTE ON FUNCTION public.is_approved(), public.is_admin(),
  public.authorize_orders(public.permission, character varying, character varying),
  public.authorize_port_events(public.permission),
  public.create_order(character varying, character varying, uuid, uuid[]),
  public.edit_order(uuid, character varying, character varying, uuid, uuid[]),
  public.replace_order_permissions(uuid, character varying, character varying, public.permission[]),
  public.replace_port_event_permissions(uuid, public.permission[]),
  public.delete_user()
TO authenticated;
GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(jsonb) TO supabase_auth_admin;
ALTER FUNCTION public.delete_user() SET search_path = '';
ALTER FUNCTION public.handle_new_user() SET search_path = '';
ALTER FUNCTION public.is_admin() SET search_path = '';

-- Uploads must belong to the signed-in user's folder; public avatar reads stay enabled.
DROP POLICY "Anyone can upload an avatar." ON storage.objects;
CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);

NOTIFY pgrst, 'reload schema';
