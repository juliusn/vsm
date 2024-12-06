create extension if not exists "pg_jsonschema" with schema "extensions";


create extension if not exists "postgis" with schema "public" version '3.3.2';

drop policy "Enable delete for authenticated users only" on "public"."locodes";

drop policy "Enable insert for authenticated users only" on "public"."locodes";

drop policy "Enable select for authenticated users only" on "public"."locodes";

drop policy "Enable delete for authenticated users only" on "public"."port-area-codes";

drop policy "Enable insert for authenticated users only" on "public"."port-area-codes";

drop policy "Enable select for authenticated users only" on "public"."port-area-codes";

drop policy "Enable update for authenticated users only" on "public"."port-area-codes";

revoke delete on table "public"."locodes" from "anon";

revoke insert on table "public"."locodes" from "anon";

revoke references on table "public"."locodes" from "anon";

revoke select on table "public"."locodes" from "anon";

revoke trigger on table "public"."locodes" from "anon";

revoke truncate on table "public"."locodes" from "anon";

revoke update on table "public"."locodes" from "anon";

revoke delete on table "public"."locodes" from "authenticated";

revoke insert on table "public"."locodes" from "authenticated";

revoke references on table "public"."locodes" from "authenticated";

revoke select on table "public"."locodes" from "authenticated";

revoke trigger on table "public"."locodes" from "authenticated";

revoke truncate on table "public"."locodes" from "authenticated";

revoke update on table "public"."locodes" from "authenticated";

revoke delete on table "public"."locodes" from "service_role";

revoke insert on table "public"."locodes" from "service_role";

revoke references on table "public"."locodes" from "service_role";

revoke select on table "public"."locodes" from "service_role";

revoke trigger on table "public"."locodes" from "service_role";

revoke truncate on table "public"."locodes" from "service_role";

revoke update on table "public"."locodes" from "service_role";

revoke delete on table "public"."port-area-codes" from "anon";

revoke insert on table "public"."port-area-codes" from "anon";

revoke references on table "public"."port-area-codes" from "anon";

revoke select on table "public"."port-area-codes" from "anon";

revoke trigger on table "public"."port-area-codes" from "anon";

revoke truncate on table "public"."port-area-codes" from "anon";

revoke update on table "public"."port-area-codes" from "anon";

revoke delete on table "public"."port-area-codes" from "authenticated";

revoke insert on table "public"."port-area-codes" from "authenticated";

revoke references on table "public"."port-area-codes" from "authenticated";

revoke select on table "public"."port-area-codes" from "authenticated";

revoke trigger on table "public"."port-area-codes" from "authenticated";

revoke truncate on table "public"."port-area-codes" from "authenticated";

revoke update on table "public"."port-area-codes" from "authenticated";

revoke delete on table "public"."port-area-codes" from "service_role";

revoke insert on table "public"."port-area-codes" from "service_role";

revoke references on table "public"."port-area-codes" from "service_role";

revoke select on table "public"."port-area-codes" from "service_role";

revoke trigger on table "public"."port-area-codes" from "service_role";

revoke truncate on table "public"."port-area-codes" from "service_role";

revoke update on table "public"."port-area-codes" from "service_role";

alter table "public"."locodes" drop constraint "locodes_pkey";

alter table "public"."port-area-codes" drop constraint "port-area-codes_pkey";

drop index if exists "public"."locodes_pkey";

drop index if exists "public"."port-area-codes_pkey";

drop table "public"."locodes";

drop table "public"."port-area-codes";

create table "public"."berth_services" (
    "titles" jsonb not null,
    "locode" character varying not null,
    "port_area_code" character varying not null,
    "berth_code" character varying not null,
    "id" uuid not null default gen_random_uuid(),
    "enabled" boolean not null default true
);


alter table "public"."berth_services" enable row level security;

create table "public"."berths" (
    "locode" character varying not null,
    "port_area_code" character varying not null,
    "berth_code" character varying not null,
    "berth_name" character varying not null,
    "enabled" boolean not null default true
);


alter table "public"."berths" enable row level security;

create table "public"."common_services" (
    "id" uuid not null default gen_random_uuid(),
    "titles" jsonb not null
);


alter table "public"."common_services" enable row level security;

create table "public"."locations" (
    "locode" character varying not null,
    "location_name" character varying not null,
    "country" character varying not null,
    "enabled" boolean not null default false
);


alter table "public"."locations" enable row level security;

create table "public"."metadata" (
    "dataset_name" text not null,
    "data_updated_time" timestamp with time zone not null
);


alter table "public"."metadata" enable row level security;

create table "public"."port_areas" (
    "port_area_code" character varying not null,
    "locode" character varying not null,
    "port_area_name" character varying not null,
    "geometry" geometry,
    "enabled" boolean not null default true
);


alter table "public"."port_areas" enable row level security;

CREATE UNIQUE INDEX berth_services_pkey ON public.berth_services USING btree (id);

CREATE UNIQUE INDEX berths_pkey ON public.berths USING btree (locode, port_area_code, berth_code);

CREATE UNIQUE INDEX locations_pkey ON public.locations USING btree (locode);

CREATE UNIQUE INDEX metadata_pkey ON public.metadata USING btree (dataset_name);

CREATE UNIQUE INDEX port_areas_pkey ON public.port_areas USING btree (port_area_code, locode);

CREATE UNIQUE INDEX port_service_descriptions_descriptions_key ON public.common_services USING btree (titles);

CREATE UNIQUE INDEX port_service_descriptions_pkey ON public.common_services USING btree (id);

CREATE UNIQUE INDEX unique_locode_port_area_berth_titles ON public.berth_services USING btree (locode, port_area_code, berth_code, titles);

alter table "public"."berth_services" add constraint "berth_services_pkey" PRIMARY KEY using index "berth_services_pkey";

alter table "public"."berths" add constraint "berths_pkey" PRIMARY KEY using index "berths_pkey";

alter table "public"."common_services" add constraint "port_service_descriptions_pkey" PRIMARY KEY using index "port_service_descriptions_pkey";

alter table "public"."locations" add constraint "locations_pkey" PRIMARY KEY using index "locations_pkey";

alter table "public"."metadata" add constraint "metadata_pkey" PRIMARY KEY using index "metadata_pkey";

alter table "public"."port_areas" add constraint "port_areas_pkey" PRIMARY KEY using index "port_areas_pkey";

alter table "public"."berth_services" add constraint "berth_services_locode_port_area_code_berth_code_fkey" FOREIGN KEY (locode, port_area_code, berth_code) REFERENCES berths(locode, port_area_code, berth_code) not valid;

alter table "public"."berth_services" validate constraint "berth_services_locode_port_area_code_berth_code_fkey";

alter table "public"."berth_services" add constraint "check_titles" CHECK (jsonb_matches_schema('{
      "type": "object",
      "properties": {
        "en": {
          "type": "string"
        },
        "fi": {
          "type": "string"
        }
      }
    }'::json, titles)) not valid;

alter table "public"."berth_services" validate constraint "check_titles";

alter table "public"."berth_services" add constraint "unique_locode_port_area_berth_titles" UNIQUE using index "unique_locode_port_area_berth_titles";

alter table "public"."berths" add constraint "berths_locode_fkey" FOREIGN KEY (locode) REFERENCES locations(locode) not valid;

alter table "public"."berths" validate constraint "berths_locode_fkey";

alter table "public"."berths" add constraint "berths_locode_port_area_code_fkey" FOREIGN KEY (locode, port_area_code) REFERENCES port_areas(locode, port_area_code) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."berths" validate constraint "berths_locode_port_area_code_fkey";

alter table "public"."common_services" add constraint "check_titles" CHECK (jsonb_matches_schema('{
      "type": "object",
      "properties": {
        "en": {
          "type": "string"
        },
        "fi": {
          "type": "string"
        }
      }
    }'::json, titles)) not valid;

alter table "public"."common_services" validate constraint "check_titles";

alter table "public"."common_services" add constraint "port_service_descriptions_descriptions_key" UNIQUE using index "port_service_descriptions_descriptions_key";

alter table "public"."port_areas" add constraint "port_areas_locode_fkey" FOREIGN KEY (locode) REFERENCES locations(locode) not valid;

alter table "public"."port_areas" validate constraint "port_areas_locode_fkey";

/* create type "public"."geometry_dump" as ("path" integer[], "geom" geometry);

create type "public"."valid_detail" as ("valid" boolean, "reason" character varying, "location" geometry); */

grant delete on table "public"."berth_services" to "anon";

grant insert on table "public"."berth_services" to "anon";

grant references on table "public"."berth_services" to "anon";

grant select on table "public"."berth_services" to "anon";

grant trigger on table "public"."berth_services" to "anon";

grant truncate on table "public"."berth_services" to "anon";

grant update on table "public"."berth_services" to "anon";

grant delete on table "public"."berth_services" to "authenticated";

grant insert on table "public"."berth_services" to "authenticated";

grant references on table "public"."berth_services" to "authenticated";

grant select on table "public"."berth_services" to "authenticated";

grant trigger on table "public"."berth_services" to "authenticated";

grant truncate on table "public"."berth_services" to "authenticated";

grant update on table "public"."berth_services" to "authenticated";

grant delete on table "public"."berth_services" to "service_role";

grant insert on table "public"."berth_services" to "service_role";

grant references on table "public"."berth_services" to "service_role";

grant select on table "public"."berth_services" to "service_role";

grant trigger on table "public"."berth_services" to "service_role";

grant truncate on table "public"."berth_services" to "service_role";

grant update on table "public"."berth_services" to "service_role";

grant delete on table "public"."berths" to "anon";

grant insert on table "public"."berths" to "anon";

grant references on table "public"."berths" to "anon";

grant select on table "public"."berths" to "anon";

grant trigger on table "public"."berths" to "anon";

grant truncate on table "public"."berths" to "anon";

grant update on table "public"."berths" to "anon";

grant delete on table "public"."berths" to "authenticated";

grant insert on table "public"."berths" to "authenticated";

grant references on table "public"."berths" to "authenticated";

grant select on table "public"."berths" to "authenticated";

grant trigger on table "public"."berths" to "authenticated";

grant truncate on table "public"."berths" to "authenticated";

grant update on table "public"."berths" to "authenticated";

grant delete on table "public"."berths" to "service_role";

grant insert on table "public"."berths" to "service_role";

grant references on table "public"."berths" to "service_role";

grant select on table "public"."berths" to "service_role";

grant trigger on table "public"."berths" to "service_role";

grant truncate on table "public"."berths" to "service_role";

grant update on table "public"."berths" to "service_role";

grant delete on table "public"."common_services" to "anon";

grant insert on table "public"."common_services" to "anon";

grant references on table "public"."common_services" to "anon";

grant select on table "public"."common_services" to "anon";

grant trigger on table "public"."common_services" to "anon";

grant truncate on table "public"."common_services" to "anon";

grant update on table "public"."common_services" to "anon";

grant delete on table "public"."common_services" to "authenticated";

grant insert on table "public"."common_services" to "authenticated";

grant references on table "public"."common_services" to "authenticated";

grant select on table "public"."common_services" to "authenticated";

grant trigger on table "public"."common_services" to "authenticated";

grant truncate on table "public"."common_services" to "authenticated";

grant update on table "public"."common_services" to "authenticated";

grant delete on table "public"."common_services" to "service_role";

grant insert on table "public"."common_services" to "service_role";

grant references on table "public"."common_services" to "service_role";

grant select on table "public"."common_services" to "service_role";

grant trigger on table "public"."common_services" to "service_role";

grant truncate on table "public"."common_services" to "service_role";

grant update on table "public"."common_services" to "service_role";

grant delete on table "public"."locations" to "anon";

grant insert on table "public"."locations" to "anon";

grant references on table "public"."locations" to "anon";

grant select on table "public"."locations" to "anon";

grant trigger on table "public"."locations" to "anon";

grant truncate on table "public"."locations" to "anon";

grant update on table "public"."locations" to "anon";

grant delete on table "public"."locations" to "authenticated";

grant insert on table "public"."locations" to "authenticated";

grant references on table "public"."locations" to "authenticated";

grant select on table "public"."locations" to "authenticated";

grant trigger on table "public"."locations" to "authenticated";

grant truncate on table "public"."locations" to "authenticated";

grant update on table "public"."locations" to "authenticated";

grant delete on table "public"."locations" to "service_role";

grant insert on table "public"."locations" to "service_role";

grant references on table "public"."locations" to "service_role";

grant select on table "public"."locations" to "service_role";

grant trigger on table "public"."locations" to "service_role";

grant truncate on table "public"."locations" to "service_role";

grant update on table "public"."locations" to "service_role";

grant delete on table "public"."metadata" to "anon";

grant insert on table "public"."metadata" to "anon";

grant references on table "public"."metadata" to "anon";

grant select on table "public"."metadata" to "anon";

grant trigger on table "public"."metadata" to "anon";

grant truncate on table "public"."metadata" to "anon";

grant update on table "public"."metadata" to "anon";

grant delete on table "public"."metadata" to "authenticated";

grant insert on table "public"."metadata" to "authenticated";

grant references on table "public"."metadata" to "authenticated";

grant select on table "public"."metadata" to "authenticated";

grant trigger on table "public"."metadata" to "authenticated";

grant truncate on table "public"."metadata" to "authenticated";

grant update on table "public"."metadata" to "authenticated";

grant delete on table "public"."metadata" to "service_role";

grant insert on table "public"."metadata" to "service_role";

grant references on table "public"."metadata" to "service_role";

grant select on table "public"."metadata" to "service_role";

grant trigger on table "public"."metadata" to "service_role";

grant truncate on table "public"."metadata" to "service_role";

grant update on table "public"."metadata" to "service_role";

grant delete on table "public"."port_areas" to "anon";

grant insert on table "public"."port_areas" to "anon";

grant references on table "public"."port_areas" to "anon";

grant select on table "public"."port_areas" to "anon";

grant trigger on table "public"."port_areas" to "anon";

grant truncate on table "public"."port_areas" to "anon";

grant update on table "public"."port_areas" to "anon";

grant delete on table "public"."port_areas" to "authenticated";

grant insert on table "public"."port_areas" to "authenticated";

grant references on table "public"."port_areas" to "authenticated";

grant select on table "public"."port_areas" to "authenticated";

grant trigger on table "public"."port_areas" to "authenticated";

grant truncate on table "public"."port_areas" to "authenticated";

grant update on table "public"."port_areas" to "authenticated";

grant delete on table "public"."port_areas" to "service_role";

grant insert on table "public"."port_areas" to "service_role";

grant references on table "public"."port_areas" to "service_role";

grant select on table "public"."port_areas" to "service_role";

grant trigger on table "public"."port_areas" to "service_role";

grant truncate on table "public"."port_areas" to "service_role";

grant update on table "public"."port_areas" to "service_role";

grant delete on table "public"."spatial_ref_sys" to "anon";

grant insert on table "public"."spatial_ref_sys" to "anon";

grant references on table "public"."spatial_ref_sys" to "anon";

grant select on table "public"."spatial_ref_sys" to "anon";

grant trigger on table "public"."spatial_ref_sys" to "anon";

grant truncate on table "public"."spatial_ref_sys" to "anon";

grant update on table "public"."spatial_ref_sys" to "anon";

grant delete on table "public"."spatial_ref_sys" to "authenticated";

grant insert on table "public"."spatial_ref_sys" to "authenticated";

grant references on table "public"."spatial_ref_sys" to "authenticated";

grant select on table "public"."spatial_ref_sys" to "authenticated";

grant trigger on table "public"."spatial_ref_sys" to "authenticated";

grant truncate on table "public"."spatial_ref_sys" to "authenticated";

grant update on table "public"."spatial_ref_sys" to "authenticated";

grant delete on table "public"."spatial_ref_sys" to "postgres";

grant insert on table "public"."spatial_ref_sys" to "postgres";

grant references on table "public"."spatial_ref_sys" to "postgres";

grant select on table "public"."spatial_ref_sys" to "postgres";

grant trigger on table "public"."spatial_ref_sys" to "postgres";

grant truncate on table "public"."spatial_ref_sys" to "postgres";

grant update on table "public"."spatial_ref_sys" to "postgres";

grant delete on table "public"."spatial_ref_sys" to "service_role";

grant insert on table "public"."spatial_ref_sys" to "service_role";

grant references on table "public"."spatial_ref_sys" to "service_role";

grant select on table "public"."spatial_ref_sys" to "service_role";

grant trigger on table "public"."spatial_ref_sys" to "service_role";

grant truncate on table "public"."spatial_ref_sys" to "service_role";

grant update on table "public"."spatial_ref_sys" to "service_role";

create policy "Enable delete for authenticated users only"
on "public"."berth_services"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."berth_services"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for authenticated users only"
on "public"."berth_services"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."berth_services"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."berths"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."berths"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."berths"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."berths"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."common_services"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."common_services"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read for authenticated users only"
on "public"."common_services"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."common_services"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."locations"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."locations"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."locations"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."locations"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."metadata"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."metadata"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."metadata"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."metadata"
as permissive
for update
to authenticated
using (true);


create policy "Enable delete for authenticated users only"
on "public"."port_areas"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."port_areas"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."port_areas"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."port_areas"
as permissive
for update
to authenticated
using (true);



