CREATE TABLE "public"."port_events" (
  "id"                       uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at"               timestamp with time zone NOT NULL DEFAULT now(),
  "estimated_date"           date                     NOT NULL,
  "estimated_time"           time without time zone,
  "berth_code"               character varying,
  "locode"                   character varying,
  "port_area_code"           character varying,
  "position"                 character varying,
  "default_duration_minutes" integer                  NOT NULL DEFAULT 120,
  "default_standby_minutes"  integer                  NOT NULL DEFAULT 30,
  "is_public"                boolean                  NOT NULL DEFAULT false,
  "max_assignees"            integer                  NOT NULL,
  CONSTRAINT "port_events_locode_port_area_code_berth_code_fkey" FOREIGN KEY (locode, port_area_code, berth_code) REFERENCES public.berths(locode, port_area_code, berth_code),
  CONSTRAINT "port_events_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."port_events"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."port_events"
  ADD COLUMN "type" public.port_event NOT NULL;

CREATE POLICY "Authorize create" ON "public"."port_events"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.authorize_port_events('create'::public.permission));

CREATE POLICY "Authorize delete" ON "public"."port_events"
  FOR DELETE
  TO "authenticated"
  USING (public.authorize_port_events('delete'::public.permission));

CREATE POLICY "Authorize edit" ON "public"."port_events"
  FOR UPDATE
  TO "authenticated"
  USING (public.authorize_port_events('edit'::public.permission))
  WITH CHECK (( SELECT public.authorize_port_events('edit'::public.permission) AS authorize_port_events));

CREATE POLICY "Authorize read" ON "public"."port_events"
  FOR SELECT
  TO "authenticated"
  USING (public.authorize_port_events('read'::public.permission));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."port_events" TO "service_role";

REVOKE ALL ON TABLE "public"."port_events" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."port_events" TO "authenticated";

REVOKE ALL ON TABLE "public"."port_events" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."port_events" TO "postgres";

REVOKE ALL ON TABLE "public"."port_events" FROM "anon";
