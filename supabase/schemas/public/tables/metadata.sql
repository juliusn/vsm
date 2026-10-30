CREATE TABLE "public"."metadata" (
  "dataset_name"      text                     NOT NULL,
  "data_updated_time" timestamp with time zone NOT NULL,
  CONSTRAINT "metadata_pkey" PRIMARY KEY (dataset_name)
);

ALTER TABLE "public"."metadata"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved admins can create" ON "public"."metadata"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can delete" ON "public"."metadata"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can edit" ON "public"."metadata"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved users can read" ON "public"."metadata"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_approved() AS is_approved));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."metadata" TO "service_role";

REVOKE ALL ON TABLE "public"."metadata" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."metadata" TO "authenticated";

REVOKE ALL ON TABLE "public"."metadata" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."metadata" TO "postgres";

REVOKE ALL ON TABLE "public"."metadata" FROM "anon";
