
  create table "public"."berthing_shiftings" (
    "id" uuid not null default gen_random_uuid(),
    "port_event" uuid not null,
    "berthing" uuid not null
      );


alter table "public"."berthing_shiftings" enable row level security;

alter table "public"."berth_services" add column "port_event" public.port_event;

alter table "public"."berth_services" add column "sort_order" integer;

CREATE UNIQUE INDEX berthing_shiftings_pkey ON public.berthing_shiftings USING btree (id);

CREATE UNIQUE INDEX berthing_shiftings_port_event_key ON public.berthing_shiftings USING btree (port_event);

alter table "public"."berthing_shiftings" add constraint "berthing_shiftings_pkey" PRIMARY KEY using index "berthing_shiftings_pkey";

alter table "public"."berthing_shiftings" add constraint "berthing_shiftings_berthing_fkey" FOREIGN KEY (berthing) REFERENCES public.berthings(id) ON DELETE CASCADE not valid;

alter table "public"."berthing_shiftings" validate constraint "berthing_shiftings_berthing_fkey";

alter table "public"."berthing_shiftings" add constraint "berthing_shiftings_port_event_fkey" FOREIGN KEY (port_event) REFERENCES public.port_events(id) ON DELETE CASCADE not valid;

alter table "public"."berthing_shiftings" validate constraint "berthing_shiftings_port_event_fkey";

alter table "public"."berthing_shiftings" add constraint "berthing_shiftings_port_event_key" UNIQUE using index "berthing_shiftings_port_event_key";

grant delete on table "public"."berthing_shiftings" to "anon";

grant insert on table "public"."berthing_shiftings" to "anon";

grant references on table "public"."berthing_shiftings" to "anon";

grant select on table "public"."berthing_shiftings" to "anon";

grant trigger on table "public"."berthing_shiftings" to "anon";

grant truncate on table "public"."berthing_shiftings" to "anon";

grant update on table "public"."berthing_shiftings" to "anon";

grant delete on table "public"."berthing_shiftings" to "authenticated";

grant insert on table "public"."berthing_shiftings" to "authenticated";

grant references on table "public"."berthing_shiftings" to "authenticated";

grant select on table "public"."berthing_shiftings" to "authenticated";

grant trigger on table "public"."berthing_shiftings" to "authenticated";

grant truncate on table "public"."berthing_shiftings" to "authenticated";

grant update on table "public"."berthing_shiftings" to "authenticated";

grant delete on table "public"."berthing_shiftings" to "service_role";

grant insert on table "public"."berthing_shiftings" to "service_role";

grant references on table "public"."berthing_shiftings" to "service_role";

grant select on table "public"."berthing_shiftings" to "service_role";

grant trigger on table "public"."berthing_shiftings" to "service_role";

grant truncate on table "public"."berthing_shiftings" to "service_role";

grant update on table "public"."berthing_shiftings" to "service_role";


  create policy "Allow all for authenticated users only"
  on "public"."berthing_shiftings"
  as permissive
  for all
  to authenticated
using (true)
with check (true);
