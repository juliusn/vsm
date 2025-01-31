create type "public"."docking_event_enum" as enum ('arrival', 'departure', 'shifting');

create table "public"."docking_events" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "type" docking_event_enum not null,
    "estimated_date" date not null,
    "estimated_time" time without time zone,
    "docking" uuid not null
);


alter table "public"."docking_events" enable row level security;

create table "public"."dockings" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "vessel_imo" integer not null,
    "vessel_name" character varying,
    "locode" character varying,
    "port_area_code" character varying,
    "berth_code" character varying
);


alter table "public"."dockings" enable row level security;

create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "vessel_imo" integer,
    "service_titles" jsonb,
    "time" timestamp with time zone
);


alter table "public"."orders" enable row level security;

CREATE UNIQUE INDEX docking_events_pkey ON public.docking_events USING btree (id);

CREATE UNIQUE INDEX dockings_pkey ON public.dockings USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

alter table "public"."docking_events" add constraint "docking_events_pkey" PRIMARY KEY using index "docking_events_pkey";

alter table "public"."dockings" add constraint "dockings_pkey" PRIMARY KEY using index "dockings_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."docking_events" add constraint "docking_events_docking_fkey" FOREIGN KEY (docking) REFERENCES dockings(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."docking_events" validate constraint "docking_events_docking_fkey";

alter table "public"."dockings" add constraint "dockings_locode_port_area_code_berth_code_fkey" FOREIGN KEY (locode, port_area_code, berth_code) REFERENCES berths(locode, port_area_code, berth_code) not valid;

alter table "public"."dockings" validate constraint "dockings_locode_port_area_code_berth_code_fkey";

grant delete on table "public"."docking_events" to "anon";

grant insert on table "public"."docking_events" to "anon";

grant references on table "public"."docking_events" to "anon";

grant select on table "public"."docking_events" to "anon";

grant trigger on table "public"."docking_events" to "anon";

grant truncate on table "public"."docking_events" to "anon";

grant update on table "public"."docking_events" to "anon";

grant delete on table "public"."docking_events" to "authenticated";

grant insert on table "public"."docking_events" to "authenticated";

grant references on table "public"."docking_events" to "authenticated";

grant select on table "public"."docking_events" to "authenticated";

grant trigger on table "public"."docking_events" to "authenticated";

grant truncate on table "public"."docking_events" to "authenticated";

grant update on table "public"."docking_events" to "authenticated";

grant delete on table "public"."docking_events" to "service_role";

grant insert on table "public"."docking_events" to "service_role";

grant references on table "public"."docking_events" to "service_role";

grant select on table "public"."docking_events" to "service_role";

grant trigger on table "public"."docking_events" to "service_role";

grant truncate on table "public"."docking_events" to "service_role";

grant update on table "public"."docking_events" to "service_role";

grant delete on table "public"."dockings" to "anon";

grant insert on table "public"."dockings" to "anon";

grant references on table "public"."dockings" to "anon";

grant select on table "public"."dockings" to "anon";

grant trigger on table "public"."dockings" to "anon";

grant truncate on table "public"."dockings" to "anon";

grant update on table "public"."dockings" to "anon";

grant delete on table "public"."dockings" to "authenticated";

grant insert on table "public"."dockings" to "authenticated";

grant references on table "public"."dockings" to "authenticated";

grant select on table "public"."dockings" to "authenticated";

grant trigger on table "public"."dockings" to "authenticated";

grant truncate on table "public"."dockings" to "authenticated";

grant update on table "public"."dockings" to "authenticated";

grant delete on table "public"."dockings" to "service_role";

grant insert on table "public"."dockings" to "service_role";

grant references on table "public"."dockings" to "service_role";

grant select on table "public"."dockings" to "service_role";

grant trigger on table "public"."dockings" to "service_role";

grant truncate on table "public"."dockings" to "service_role";

grant update on table "public"."dockings" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

create policy "Enable delete for authenticated users only"
on "public"."docking_events"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."docking_events"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."docking_events"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."docking_events"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."dockings"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."dockings"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."dockings"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."dockings"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."orders"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."orders"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."orders"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."orders"
as permissive
for update
to authenticated
using (true)
with check (true);



