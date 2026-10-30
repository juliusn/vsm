CREATE TABLE "public"."berthings" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "created_at"  timestamp with time zone NOT NULL DEFAULT now(),
  "vessel_imo"  integer                  NOT NULL,
  "vessel_name" character varying,
  "arrival"     uuid,
  "departure"   uuid,
  CONSTRAINT "dockings_pkey" PRIMARY KEY (id),
  CONSTRAINT "berthings_arrival_fkey" FOREIGN KEY (arrival) REFERENCES public.port_events(id) ON DELETE SET NULL,
  CONSTRAINT "berthings_departure_fkey" FOREIGN KEY (departure) REFERENCES public.port_events(id) ON DELETE SET NULL
);

ALTER TABLE "public"."berthings"
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authorize create" ON "public"."berthings"
  FOR INSERT
  TO "authenticated"
  WITH CHECK (public.authorize_port_events('create'::public.permission));

CREATE POLICY "Authorize delete" ON "public"."berthings"
  FOR DELETE
  TO "authenticated"
  USING (public.authorize_port_events('delete'::public.permission));

CREATE POLICY "Authorize edit" ON "public"."berthings"
  FOR UPDATE
  TO "authenticated"
  USING (public.authorize_port_events('edit'::public.permission))
  WITH CHECK (( SELECT public.authorize_port_events('edit'::public.permission) AS authorize_port_events));

CREATE POLICY "Authorize read" ON "public"."berthings"
  FOR SELECT
  TO "authenticated"
  USING (public.authorize_port_events('read'::public.permission));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."berthings" TO "service_role";

REVOKE ALL ON TABLE "public"."berthings" FROM "authenticated";

GRANT DELETE, INSERT, SELECT, UPDATE ON TABLE "public"."berthings" TO "authenticated";

REVOKE ALL ON TABLE "public"."berthings" FROM "postgres";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."berthings" TO "postgres";

REVOKE ALL ON TABLE "public"."berthings" FROM "anon";
