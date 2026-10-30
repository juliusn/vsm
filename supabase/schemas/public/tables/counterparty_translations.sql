CREATE TABLE "public"."counterparty_translations" (
  "counterparty" character varying        NOT NULL,
  "created_at"   timestamp with time zone NOT NULL DEFAULT now(),
  "title"        character varying        NOT NULL,
  CONSTRAINT "counterparty_names_counterparty_fkey" FOREIGN KEY (counterparty) REFERENCES public.counterparties(business_id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE "public"."counterparty_translations"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."counterparty_translations"
  ADD COLUMN "locale" public.locale NOT NULL;

ALTER TABLE "public"."counterparty_translations"
  ADD CONSTRAINT "counterparty_names_pkey" PRIMARY KEY (counterparty, LOCALE);

CREATE UNIQUE INDEX counterparty_translations_locale_title_key ON public.counterparty_translations USING btree (LOCALE, lower((title)::text));

CREATE POLICY "Approved admins can create" ON "public"."counterparty_translations"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can delete" ON "public"."counterparty_translations"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can edit" ON "public"."counterparty_translations"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved users can read" ON "public"."counterparty_translations"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_approved() AS is_approved));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."counterparty_translations" TO "service_role";

REVOKE ALL ON TABLE "public"."counterparty_translations" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."counterparty_translations" TO "authenticated";

REVOKE ALL ON TABLE "public"."counterparty_translations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."counterparty_translations" TO "postgres";

REVOKE ALL ON TABLE "public"."counterparty_translations" FROM "anon";
