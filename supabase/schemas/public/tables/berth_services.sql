CREATE TABLE "public"."berth_services" (
  "locode"         character varying NOT NULL,
  "port_area_code" character varying NOT NULL,
  "berth_code"     character varying NOT NULL,
  "id"             uuid              NOT NULL DEFAULT gen_random_uuid(),
  "enabled"        boolean           NOT NULL DEFAULT true,
  "sort_order"     integer           NOT NULL DEFAULT '-1'::integer,
  CONSTRAINT "berth_services_berth_sort_order_key" UNIQUE (locode, port_area_code, berth_code, sort_order) DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT "berth_services_pkey" PRIMARY KEY (id),
  CONSTRAINT "berth_services_locode_port_area_code_berth_code_fkey" FOREIGN KEY (locode, port_area_code, berth_code) REFERENCES public.berths(locode, port_area_code, berth_code)
);

ALTER TABLE "public"."berth_services"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."berth_services"
  ADD COLUMN "port_event" public.port_event;

CREATE TRIGGER berth_services_insert_trigger
  BEFORE INSERT ON public.berth_services
  FOR EACH ROW
  EXECUTE FUNCTION public.set_berth_service_sort_order();

CREATE POLICY "Approved admins can create" ON "public"."berth_services"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can delete" ON "public"."berth_services"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can edit" ON "public"."berth_services"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved users can read" ON "public"."berth_services"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_approved() AS is_approved));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."berth_services" TO "service_role";

REVOKE ALL ON TABLE "public"."berth_services" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."berth_services" TO "authenticated";

REVOKE ALL ON TABLE "public"."berth_services" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."berth_services" TO "postgres";

REVOKE ALL ON TABLE "public"."berth_services" FROM "anon";
