CREATE TABLE "public"."port_areas" (
  "port_area_code" character varying   NOT NULL,
  "locode"         character varying   NOT NULL,
  "port_area_name" character varying   NOT NULL,
  "geometry"       extensions.geometry,
  "enabled"        boolean             NOT NULL DEFAULT true,
  CONSTRAINT "port_areas_locode_fkey" FOREIGN KEY (locode) REFERENCES public.locations(locode),
  CONSTRAINT "port_areas_pkey" PRIMARY KEY (port_area_code, locode)
);

ALTER TABLE "public"."port_areas"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved admins can create" ON "public"."port_areas"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can delete" ON "public"."port_areas"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can edit" ON "public"."port_areas"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved users can read" ON "public"."port_areas"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_approved() AS is_approved));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."port_areas" TO "service_role";

REVOKE ALL ON TABLE "public"."port_areas" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."port_areas" TO "authenticated";

REVOKE ALL ON TABLE "public"."port_areas" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."port_areas" TO "postgres";

REVOKE ALL ON TABLE "public"."port_areas" FROM "anon";
