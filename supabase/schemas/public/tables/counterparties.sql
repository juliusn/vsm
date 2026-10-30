CREATE TABLE "public"."counterparties" (
  "business_id" character varying(9)     NOT NULL,
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "name"        character varying        NOT NULL,
  CONSTRAINT "counterparties_pkey" PRIMARY KEY (business_id)
);

ALTER TABLE "public"."counterparties"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved admins can create" ON "public"."counterparties"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can delete" ON "public"."counterparties"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can edit" ON "public"."counterparties"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved users can read" ON "public"."counterparties"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_approved() AS is_approved));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."counterparties" TO "service_role";

REVOKE ALL ON TABLE "public"."counterparties" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."counterparties" TO "authenticated";

REVOKE ALL ON TABLE "public"."counterparties" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."counterparties" TO "postgres";

REVOKE ALL ON TABLE "public"."counterparties" FROM "anon";
