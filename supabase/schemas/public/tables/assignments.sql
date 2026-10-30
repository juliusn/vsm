CREATE TABLE "public"."assignments" (
  "id"               uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at"       timestamp with time zone NOT NULL DEFAULT now(),
  "port_event"       uuid                     NOT NULL,
  "assignee"         uuid                     NOT NULL,
  "standby_minutes"  integer                  NOT NULL,
  "duration_minutes" integer                  NOT NULL,
  CONSTRAINT "assignments_pkey" PRIMARY KEY (id),
  CONSTRAINT "assignments_port_event_assignee_key" UNIQUE (port_event, assignee),
  CONSTRAINT "assignments_port_event_fkey" FOREIGN KEY (port_event) REFERENCES public.port_events(id),
  CONSTRAINT "assignments_assignee_fkey" FOREIGN KEY (assignee) REFERENCES public.profiles(id)
);

ALTER TABLE "public"."assignments"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authorize create" ON "public"."assignments"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (( SELECT public.authorize_port_events('edit'::public.permission) AS authorize_port_events));

CREATE POLICY "Authorize delete" ON "public"."assignments"
  FOR DELETE
  TO "authenticated"
  USING (( SELECT public.authorize_port_events('edit'::public.permission) AS authorize_port_events));

CREATE POLICY "Authorize edit" ON "public"."assignments"
  FOR UPDATE
  TO "authenticated"
  USING (( SELECT public.authorize_port_events('edit'::public.permission) AS authorize_port_events))
  WITH CHECK (( SELECT public.authorize_port_events('edit'::public.permission) AS authorize_port_events));

CREATE POLICY "Authorize read" ON "public"."assignments"
  FOR SELECT
  TO "authenticated"
  USING (( SELECT public.authorize_port_events('read'::public.permission) AS authorize_port_events));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."assignments" TO "service_role";

REVOKE ALL ON TABLE "public"."assignments" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."assignments" TO "authenticated";

REVOKE ALL ON TABLE "public"."assignments" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."assignments" TO "postgres";

REVOKE ALL ON TABLE "public"."assignments" FROM "anon";
