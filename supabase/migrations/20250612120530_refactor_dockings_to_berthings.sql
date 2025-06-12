create type "public"."port_event_enum" as enum ('arrival', 'departure', 'shifting');

drop policy "Enable delete for authenticated users only" on "public"."docking_events";

drop policy "Enable insert for authenticated users only" on "public"."docking_events";

drop policy "Enable select for authenticated users only" on "public"."docking_events";

drop policy "Enable update for authenticated users only" on "public"."docking_events";

drop policy "Enable delete for authenticated users only" on "public"."dockings";

drop policy "Enable insert for authenticated users only" on "public"."dockings";

drop policy "Enable select for authenticated users only" on "public"."dockings";

drop policy "Enable update for authenticated users only" on "public"."dockings";

revoke delete on table "public"."docking_events" from "anon";

revoke insert on table "public"."docking_events" from "anon";

revoke references on table "public"."docking_events" from "anon";

revoke select on table "public"."docking_events" from "anon";

revoke trigger on table "public"."docking_events" from "anon";

revoke truncate on table "public"."docking_events" from "anon";

revoke update on table "public"."docking_events" from "anon";

revoke delete on table "public"."docking_events" from "authenticated";

revoke insert on table "public"."docking_events" from "authenticated";

revoke references on table "public"."docking_events" from "authenticated";

revoke select on table "public"."docking_events" from "authenticated";

revoke trigger on table "public"."docking_events" from "authenticated";

revoke truncate on table "public"."docking_events" from "authenticated";

revoke update on table "public"."docking_events" from "authenticated";

revoke delete on table "public"."docking_events" from "service_role";

revoke insert on table "public"."docking_events" from "service_role";

revoke references on table "public"."docking_events" from "service_role";

revoke select on table "public"."docking_events" from "service_role";

revoke trigger on table "public"."docking_events" from "service_role";

revoke truncate on table "public"."docking_events" from "service_role";

revoke update on table "public"."docking_events" from "service_role";

revoke delete on table "public"."dockings" from "anon";

revoke insert on table "public"."dockings" from "anon";

revoke references on table "public"."dockings" from "anon";

revoke select on table "public"."dockings" from "anon";

revoke trigger on table "public"."dockings" from "anon";

revoke truncate on table "public"."dockings" from "anon";

revoke update on table "public"."dockings" from "anon";

revoke delete on table "public"."dockings" from "authenticated";

revoke insert on table "public"."dockings" from "authenticated";

revoke references on table "public"."dockings" from "authenticated";

revoke select on table "public"."dockings" from "authenticated";

revoke trigger on table "public"."dockings" from "authenticated";

revoke truncate on table "public"."dockings" from "authenticated";

revoke update on table "public"."dockings" from "authenticated";

revoke delete on table "public"."dockings" from "service_role";

revoke insert on table "public"."dockings" from "service_role";

revoke references on table "public"."dockings" from "service_role";

revoke select on table "public"."dockings" from "service_role";

revoke trigger on table "public"."dockings" from "service_role";

revoke truncate on table "public"."dockings" from "service_role";

revoke update on table "public"."dockings" from "service_role";

alter table "public"."docking_events" drop constraint "docking_events_docking_fkey";

alter table "public"."dockings" drop constraint "dockings_locode_port_area_code_berth_code_fkey";

alter table "public"."orders" drop constraint "orders_docking_fkey";

alter table "public"."orders" drop constraint "orders_docking_key";

alter table "public"."docking_events" drop constraint "docking_events_pkey";

alter table "public"."dockings" drop constraint "dockings_pkey";

drop index if exists "public"."docking_events_pkey";

drop index if exists "public"."dockings_pkey";

drop index if exists "public"."orders_docking_key";

drop table "public"."docking_events";

drop table "public"."dockings";

create table "public"."berthings" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "vessel_imo" integer not null,
    "vessel_name" character varying,
    "locode" character varying,
    "port_area_code" character varying,
    "berth_code" character varying
);


alter table "public"."berthings" enable row level security;

create table "public"."port_events" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "type" port_event_enum not null,
    "estimated_date" date not null,
    "estimated_time" time without time zone,
    "berthing" uuid not null
);


alter table "public"."port_events" enable row level security;

alter table "public"."orders" drop column "docking";

alter table "public"."orders" add column "berthing" uuid not null;

drop type "public"."docking_event_enum";

CREATE UNIQUE INDEX docking_events_pkey ON public.port_events USING btree (id);

CREATE UNIQUE INDEX dockings_pkey ON public.berthings USING btree (id);

CREATE UNIQUE INDEX orders_docking_key ON public.orders USING btree (berthing);

alter table "public"."berthings" add constraint "dockings_pkey" PRIMARY KEY using index "dockings_pkey";

alter table "public"."port_events" add constraint "docking_events_pkey" PRIMARY KEY using index "docking_events_pkey";

alter table "public"."berthings" add constraint "berthings_locode_port_area_code_berth_code_fkey" FOREIGN KEY (locode, port_area_code, berth_code) REFERENCES berths(locode, port_area_code, berth_code) not valid;

alter table "public"."berthings" validate constraint "berthings_locode_port_area_code_berth_code_fkey";

alter table "public"."orders" add constraint "orders_berthing_fkey" FOREIGN KEY (berthing) REFERENCES berthings(id) not valid;

alter table "public"."orders" validate constraint "orders_berthing_fkey";

alter table "public"."port_events" add constraint "port_events_berthing_fkey" FOREIGN KEY (berthing) REFERENCES berthings(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."port_events" validate constraint "port_events_berthing_fkey";

alter table "public"."orders" add constraint "orders_docking_key" UNIQUE using index "orders_docking_key";

grant delete on table "public"."berthings" to "anon";

grant insert on table "public"."berthings" to "anon";

grant references on table "public"."berthings" to "anon";

grant select on table "public"."berthings" to "anon";

grant trigger on table "public"."berthings" to "anon";

grant truncate on table "public"."berthings" to "anon";

grant update on table "public"."berthings" to "anon";

grant delete on table "public"."berthings" to "authenticated";

grant insert on table "public"."berthings" to "authenticated";

grant references on table "public"."berthings" to "authenticated";

grant select on table "public"."berthings" to "authenticated";

grant trigger on table "public"."berthings" to "authenticated";

grant truncate on table "public"."berthings" to "authenticated";

grant update on table "public"."berthings" to "authenticated";

grant delete on table "public"."berthings" to "service_role";

grant insert on table "public"."berthings" to "service_role";

grant references on table "public"."berthings" to "service_role";

grant select on table "public"."berthings" to "service_role";

grant trigger on table "public"."berthings" to "service_role";

grant truncate on table "public"."berthings" to "service_role";

grant update on table "public"."berthings" to "service_role";

grant delete on table "public"."port_events" to "anon";

grant insert on table "public"."port_events" to "anon";

grant references on table "public"."port_events" to "anon";

grant select on table "public"."port_events" to "anon";

grant trigger on table "public"."port_events" to "anon";

grant truncate on table "public"."port_events" to "anon";

grant update on table "public"."port_events" to "anon";

grant delete on table "public"."port_events" to "authenticated";

grant insert on table "public"."port_events" to "authenticated";

grant references on table "public"."port_events" to "authenticated";

grant select on table "public"."port_events" to "authenticated";

grant trigger on table "public"."port_events" to "authenticated";

grant truncate on table "public"."port_events" to "authenticated";

grant update on table "public"."port_events" to "authenticated";

grant delete on table "public"."port_events" to "service_role";

grant insert on table "public"."port_events" to "service_role";

grant references on table "public"."port_events" to "service_role";

grant select on table "public"."port_events" to "service_role";

grant trigger on table "public"."port_events" to "service_role";

grant truncate on table "public"."port_events" to "service_role";

grant update on table "public"."port_events" to "service_role";

create policy "Enable delete for authenticated users only"
on "public"."berthings"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."berthings"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."berthings"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."berthings"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."port_events"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."port_events"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."port_events"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."port_events"
as permissive
for update
to authenticated
using (true);



