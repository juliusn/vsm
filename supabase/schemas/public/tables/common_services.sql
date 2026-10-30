CREATE TABLE "public"."common_services" (
  "id"         uuid    NOT NULL DEFAULT gen_random_uuid(),
  "sort_order" integer,
  CONSTRAINT "common_services_sort_order_not_null" CHECK ((sort_order IS NOT NULL)),
  CONSTRAINT "port_service_descriptions_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."common_services"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."common_services"
  ADD COLUMN "port_event" public.port_event;

CREATE TRIGGER common_services_insert_trigger
  BEFORE INSERT ON public.common_services
  FOR EACH ROW
  EXECUTE FUNCTION public.set_sort_order();

CREATE POLICY "Approved admins can create" ON "public"."common_services"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can delete" ON "public"."common_services"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can edit" ON "public"."common_services"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved users can read" ON "public"."common_services"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_approved() AS is_approved));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."common_services" TO "service_role";

REVOKE ALL ON TABLE "public"."common_services" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."common_services" TO "authenticated";

REVOKE ALL ON TABLE "public"."common_services" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."common_services" TO "postgres";

REVOKE ALL ON TABLE "public"."common_services" FROM "anon";
