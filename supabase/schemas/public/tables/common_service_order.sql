CREATE TABLE "public"."common_service_order" (
  "id"             uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at"     timestamp with time zone NOT NULL DEFAULT now(),
  "common_service" uuid                     NOT NULL,
  "order"          uuid                     NOT NULL,
  CONSTRAINT "common_service_order_pkey" PRIMARY KEY (common_service, "order"),
  CONSTRAINT "unique_common_service_order" UNIQUE ("order", common_service),
  CONSTRAINT "common_service_order_common_service_fkey" FOREIGN KEY (common_service) REFERENCES public.common_services(id) ON DELETE CASCADE,
  CONSTRAINT "common_service_order_order_fkey" FOREIGN KEY ("order") REFERENCES public.orders(id) ON DELETE CASCADE
);

ALTER TABLE "public"."common_service_order"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authorize create" ON "public"."common_service_order"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (private.authorize_order_services("order", 'edit'::public.permission));

CREATE POLICY "Authorize delete" ON "public"."common_service_order"
  FOR DELETE
  TO "authenticated"
  USING (private.authorize_order_services("order", 'edit'::public.permission));

CREATE POLICY "Authorize read" ON "public"."common_service_order"
  FOR SELECT
  TO "authenticated"
  USING (private.authorize_order_services("order", 'read'::public.permission));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."common_service_order" TO "service_role";

REVOKE ALL ON TABLE "public"."common_service_order" FROM "authenticated";

GRANT DELETE, INSERT, SELECT ON TABLE "public"."common_service_order" TO "authenticated";

REVOKE ALL ON TABLE "public"."common_service_order" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."common_service_order" TO "postgres";

REVOKE ALL ON TABLE "public"."common_service_order" FROM "anon";
