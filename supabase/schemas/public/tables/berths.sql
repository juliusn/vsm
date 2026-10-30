CREATE TABLE "public"."berths" (
  "locode"         character varying NOT NULL,
  "port_area_code" character varying NOT NULL,
  "berth_code"     character varying NOT NULL,
  "berth_name"     character varying NOT NULL,
  "enabled"        boolean           NOT NULL DEFAULT true,
  CONSTRAINT "berths_pkey" PRIMARY KEY (locode, port_area_code, berth_code),
  CONSTRAINT "berths_locode_fkey" FOREIGN KEY (locode) REFERENCES public.locations(locode),
  CONSTRAINT "berths_locode_port_area_code_fkey" FOREIGN KEY (locode, port_area_code) REFERENCES public.port_areas(locode, port_area_code) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE "public"."berths"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved admins can create" ON "public"."berths"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can delete" ON "public"."berths"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can edit" ON "public"."berths"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved users can read" ON "public"."berths"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_approved() AS is_approved));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."berths" TO "service_role";

REVOKE ALL ON TABLE "public"."berths" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."berths" TO "authenticated";

REVOKE ALL ON TABLE "public"."berths" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."berths" TO "postgres";

REVOKE ALL ON TABLE "public"."berths" FROM "anon";
