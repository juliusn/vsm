CREATE TABLE "public"."locations" (
  "locode"        character varying NOT NULL,
  "location_name" character varying NOT NULL,
  "country"       character varying NOT NULL,
  "enabled"       boolean           NOT NULL DEFAULT false,
  CONSTRAINT "locations_pkey" PRIMARY KEY (locode)
);

ALTER TABLE "public"."locations"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved admins can create" ON "public"."locations"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can delete" ON "public"."locations"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can edit" ON "public"."locations"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved users can read" ON "public"."locations"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_approved() AS is_approved));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "service_role";

REVOKE ALL ON TABLE "public"."locations" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."locations" TO "authenticated";

REVOKE ALL ON TABLE "public"."locations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."locations" TO "postgres";

REVOKE ALL ON TABLE "public"."locations" FROM "anon";
