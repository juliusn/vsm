CREATE TABLE "public"."berthing_shiftings" (
  "id"         uuid NOT NULL DEFAULT gen_random_uuid(),
  "port_event" uuid NOT NULL,
  "berthing"   uuid NOT NULL,
  CONSTRAINT "berthing_shiftings_pkey" PRIMARY KEY (id),
  CONSTRAINT "berthing_shiftings_port_event_key" UNIQUE (port_event),
  CONSTRAINT "berthing_shiftings_berthing_fkey" FOREIGN KEY (berthing) REFERENCES public.berthings(id) ON DELETE CASCADE,
  CONSTRAINT "berthing_shiftings_port_event_fkey" FOREIGN KEY (port_event) REFERENCES public.port_events(id) ON DELETE CASCADE
);

ALTER TABLE "public"."berthing_shiftings"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authorize create" ON "public"."berthing_shiftings"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.authorize_port_events('create'::public.permission));

CREATE POLICY "Authorize delete" ON "public"."berthing_shiftings"
  FOR DELETE
  TO "authenticated"
  USING (public.authorize_port_events('delete'::public.permission));

CREATE POLICY "Authorize edit" ON "public"."berthing_shiftings"
  FOR UPDATE
  TO "authenticated"
  USING (public.authorize_port_events('edit'::public.permission))
  WITH CHECK (( SELECT public.authorize_port_events('edit'::public.permission) AS authorize_port_events));

CREATE POLICY "Authorize read" ON "public"."berthing_shiftings"
  FOR SELECT
  TO "authenticated"
  USING (public.authorize_port_events('read'::public.permission));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."berthing_shiftings" TO "service_role";

REVOKE ALL ON TABLE "public"."berthing_shiftings" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."berthing_shiftings" TO "authenticated";

REVOKE ALL ON TABLE "public"."berthing_shiftings" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."berthing_shiftings" TO "postgres";

REVOKE ALL ON TABLE "public"."berthing_shiftings" FROM "anon";
