CREATE TABLE "public"."profiles" (
  "id"                     uuid                     NOT NULL,
  "updated_at"             timestamp with time zone,
  "first_name"             text                     NOT NULL,
  "approval_status_set_by" uuid,
  "last_name"              text,
  "admin"                  boolean                  NOT NULL DEFAULT false,
  CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id),
  CONSTRAINT "username_length" CHECK ((char_length(first_name) >= 3))
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles"
  ADD COLUMN "approval_status" public.approval_status NOT NULL DEFAULT 'pending'::public.approval_status;

CREATE POLICY "Allow admin users to update profiles" ON "public"."profiles"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT (public.is_approved() AND public.is_admin())))
  WITH CHECK (( SELECT (public.is_approved() AND public.is_admin())));

CREATE POLICY "Allow approved users to read profiles" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING (public.is_approved());

CREATE POLICY "Allow supabase_auth_admin to read profiles" ON "public"."profiles"
  FOR SELECT
  TO "supabase_auth_admin"
  USING (true);

CREATE POLICY "Users can read their own profile" ON "public"."profiles"
  FOR SELECT
  TO "authenticated"
  USING ((id = ( SELECT auth.uid() AS uid)));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "service_role";

GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "supabase_auth_admin";

REVOKE ALL ON TABLE "public"."profiles" FROM "authenticated";

GRANT SELECT, UPDATE ON TABLE "public"."profiles" TO "authenticated";

REVOKE ALL ON TABLE "public"."profiles" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "postgres";

REVOKE ALL ON TABLE "public"."profiles" FROM "anon";
