CREATE TABLE "public"."order_permissions" (
  "id"                                uuid              NOT NULL DEFAULT gen_random_uuid(),
  "user_id"                           uuid              NOT NULL,
  "sender_counterparty_business_id"   character varying NOT NULL,
  "receiver_counterparty_business_id" character varying NOT NULL,
  CONSTRAINT "order_permissions_receiver_counterparty_business_id_fkey" FOREIGN KEY (receiver_counterparty_business_id) REFERENCES public.counterparties(business_id)
    ON DELETE CASCADE,
  CONSTRAINT "order_permissions_sender_counterparty_business_id_fkey" FOREIGN KEY (sender_counterparty_business_id) REFERENCES public.counterparties(business_id) ON DELETE CASCADE,
  CONSTRAINT "order_permissions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT "user_order_scopes_pkey" PRIMARY KEY (id),
  CONSTRAINT "order_permissions_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE
);

ALTER TABLE "public"."order_permissions"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."order_permissions"
  ADD COLUMN "permission" public.permission NOT NULL;

ALTER TABLE "public"."order_permissions"
  ADD CONSTRAINT "user_order_scopes_unique_scope" UNIQUE (user_id, permission, sender_counterparty_business_id, receiver_counterparty_business_id);

CREATE POLICY "Allow approved admin users to do anything" ON "public"."order_permissions"
  FOR ALL
  TO "authenticated"
  USING ((public.is_admin() AND public.is_approved()))
  WITH CHECK ((public.is_admin() AND public.is_approved()));

CREATE POLICY "Enable users to view their own data only" ON "public"."order_permissions"
  FOR SELECT
  TO "authenticated"
  USING ((( SELECT auth.uid() AS uid) = user_id));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."order_permissions" TO "service_role";

REVOKE ALL ON TABLE "public"."order_permissions" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."order_permissions" TO "authenticated";

REVOKE ALL ON TABLE "public"."order_permissions" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."order_permissions" TO "postgres";

REVOKE ALL ON TABLE "public"."order_permissions" FROM "anon";
