CREATE TABLE "public"."port_event_permissions" (
  "id"      uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL,
  CONSTRAINT "port_event_permissions_pkey" PRIMARY KEY (id),
  CONSTRAINT "port_event_permissions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

ALTER TABLE "public"."port_event_permissions"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."port_event_permissions"
  ADD COLUMN "permission" public.permission NOT NULL;

ALTER TABLE "public"."port_event_permissions"
  ADD CONSTRAINT "port_event_permissions_user_permission_key" UNIQUE (user_id, permission);

CREATE POLICY "Allow approved admin users to do anything" ON "public"."port_event_permissions"
  FOR ALL
  TO "authenticated"
  USING ((public.is_admin() AND public.is_approved()))
  WITH CHECK ((public.is_admin() AND public.is_approved()));

CREATE POLICY "Allow users to view their own data" ON "public"."port_event_permissions"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

REVOKE ALL ON TABLE "public"."port_event_permissions" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."port_event_permissions" TO "authenticated";

REVOKE ALL ON TABLE "public"."port_event_permissions" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."port_event_permissions" TO "postgres";

REVOKE ALL ON TABLE "public"."port_event_permissions" FROM "service_role";

GRANT MAINTAIN, REFERENCES, TRIGGER, TRUNCATE ON TABLE "public"."port_event_permissions" TO "service_role";

REVOKE ALL ON TABLE "public"."port_event_permissions" FROM "anon";
