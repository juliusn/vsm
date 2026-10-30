CREATE TABLE "public"."orders" (
  "id"                                uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at"                        timestamp with time zone NOT NULL DEFAULT now(),
  "berthing"                          uuid                     NOT NULL,
  "receiver_counterparty_business_id" character varying        NOT NULL,
  "sender_counterparty_business_id"   character varying        NOT NULL,
  CONSTRAINT "orders_berthing_fkey" FOREIGN KEY (berthing) REFERENCES public.berthings(id),
  CONSTRAINT "orders_docking_key" UNIQUE (berthing),
  CONSTRAINT "orders_pkey" PRIMARY KEY (id),
  CONSTRAINT "orders_receiver_fkey" FOREIGN KEY (receiver_counterparty_business_id) REFERENCES public.counterparties(business_id) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT "orders_sender_fkey" FOREIGN KEY (sender_counterparty_business_id) REFERENCES public.counterparties(business_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

ALTER TABLE "public"."orders"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."orders"
  ADD COLUMN "status" public.order_status NOT NULL DEFAULT 'submitted'::public.order_status;

CREATE POLICY "Authorize create" ON "public"."orders"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.authorize_orders('create'::public.permission, sender_counterparty_business_id, receiver_counterparty_business_id));

CREATE POLICY "Authorize delete" ON "public"."orders"
  FOR DELETE
  TO "authenticated"
  USING (public.authorize_orders('delete'::public.permission, sender_counterparty_business_id, receiver_counterparty_business_id));

CREATE POLICY "Authorize edit" ON "public"."orders"
  FOR UPDATE
  TO "authenticated"
  USING (public.authorize_orders('edit'::public.permission, sender_counterparty_business_id, receiver_counterparty_business_id));

CREATE POLICY "Authorize read" ON "public"."orders"
  FOR SELECT
  TO "authenticated"
  USING (public.authorize_orders('read'::public.permission, sender_counterparty_business_id, receiver_counterparty_business_id));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orders" TO "service_role";

REVOKE ALL ON TABLE "public"."orders" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."orders" TO "authenticated";

REVOKE ALL ON TABLE "public"."orders" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."orders" TO "postgres";

REVOKE ALL ON TABLE "public"."orders" FROM "anon";
