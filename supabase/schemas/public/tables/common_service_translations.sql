CREATE TABLE "public"."common_service_translations" (
  "common_service" uuid NOT NULL,
  "title"          text NOT NULL,
  "abbreviation"   text NOT NULL,
  CONSTRAINT "common_service_translations_service_fkey" FOREIGN KEY (common_service) REFERENCES public.common_services(id) ON DELETE CASCADE
);

ALTER TABLE "public"."common_service_translations"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."common_service_translations"
  ADD COLUMN "locale" public.locale NOT NULL;

ALTER TABLE "public"."common_service_translations"
  ADD CONSTRAINT "common_service_translations_pkey" PRIMARY KEY (common_service, LOCALE);

CREATE UNIQUE INDEX common_service_translations_locale_abbreviation_key ON public.common_service_translations USING btree (LOCALE, lower(abbreviation));

CREATE UNIQUE INDEX common_service_translations_locale_title_key ON public.common_service_translations USING btree (LOCALE, lower(title));

CREATE POLICY "Approved admins can create" ON "public"."common_service_translations"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can delete" ON "public"."common_service_translations"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved admins can edit" ON "public"."common_service_translations"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Approved users can read" ON "public"."common_service_translations"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.is_approved() AS is_approved));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."common_service_translations" TO "service_role";

REVOKE ALL ON TABLE "public"."common_service_translations" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."common_service_translations" TO "authenticated";

REVOKE ALL ON TABLE "public"."common_service_translations" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."common_service_translations" TO "postgres";

REVOKE ALL ON TABLE "public"."common_service_translations" FROM "anon";
