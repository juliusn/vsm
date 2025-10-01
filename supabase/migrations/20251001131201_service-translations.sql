drop policy "Enable delete for authenticated users only" on "public"."counterparty_names";

drop policy "Enable insert for authenticated users only" on "public"."counterparty_names";

drop policy "Enable select for authenticated users only" on "public"."counterparty_names";

drop policy "Enable update for authenticated users only" on "public"."counterparty_names";

revoke delete on table "public"."counterparty_names" from "anon";

revoke insert on table "public"."counterparty_names" from "anon";

revoke references on table "public"."counterparty_names" from "anon";

revoke select on table "public"."counterparty_names" from "anon";

revoke trigger on table "public"."counterparty_names" from "anon";

revoke truncate on table "public"."counterparty_names" from "anon";

revoke update on table "public"."counterparty_names" from "anon";

revoke delete on table "public"."counterparty_names" from "authenticated";

revoke insert on table "public"."counterparty_names" from "authenticated";

revoke references on table "public"."counterparty_names" from "authenticated";

revoke select on table "public"."counterparty_names" from "authenticated";

revoke trigger on table "public"."counterparty_names" from "authenticated";

revoke truncate on table "public"."counterparty_names" from "authenticated";

revoke update on table "public"."counterparty_names" from "authenticated";

revoke delete on table "public"."counterparty_names" from "service_role";

revoke insert on table "public"."counterparty_names" from "service_role";

revoke references on table "public"."counterparty_names" from "service_role";

revoke select on table "public"."counterparty_names" from "service_role";

revoke trigger on table "public"."counterparty_names" from "service_role";

revoke truncate on table "public"."counterparty_names" from "service_role";

revoke update on table "public"."counterparty_names" from "service_role";

alter table "public"."berth_services" drop constraint "check_titles";

alter table "public"."berth_services" drop constraint "unique_locode_port_area_berth_titles";

alter table "public"."common_services" drop constraint "check_titles";

alter table "public"."common_services" drop constraint "port_service_descriptions_descriptions_key";

alter table "public"."counterparty_names" drop constraint "counterparty_names_counterparty_fkey";

alter table "public"."counterparty_names" drop constraint "counterparty_names_pkey";

drop index if exists "public"."port_service_descriptions_descriptions_key";

drop index if exists "public"."unique_locode_port_area_berth_titles";

drop index if exists "public"."counterparty_names_pkey";

drop table "public"."counterparty_names";

create table "public"."berth_service_translations" (
    "berth_service" uuid not null,
    "locale" locale not null,
    "title" text not null,
    "abbreviation" text not null
);


create table "public"."common_service_translations" (
    "common_service" uuid not null,
    "locale" locale not null,
    "title" text not null,
    "abbreviation" text not null
);


create table "public"."counterparty_translations" (
    "counterparty" character varying not null,
    "locale" locale not null,
    "created_at" timestamp with time zone not null default now(),
    "title" character varying not null
);


alter table "public"."counterparty_translations" enable row level security;

alter table "public"."berth_services" drop column "titles";

alter table "public"."common_services" drop column "titles";

CREATE UNIQUE INDEX berth_service_translations_locale_abbreviation_key ON public.berth_service_translations USING btree (locale, lower(abbreviation));

CREATE UNIQUE INDEX berth_service_translations_locale_title_key ON public.berth_service_translations USING btree (locale, lower(title));

CREATE UNIQUE INDEX berth_service_translations_pkey ON public.berth_service_translations USING btree (berth_service, locale);

CREATE UNIQUE INDEX common_service_translations_locale_abbreviation_key ON public.common_service_translations USING btree (locale, lower(abbreviation));

CREATE UNIQUE INDEX common_service_translations_locale_title_key ON public.common_service_translations USING btree (locale, lower(title));

CREATE UNIQUE INDEX common_service_translations_pkey ON public.common_service_translations USING btree (common_service, locale);

CREATE UNIQUE INDEX counterparty_translations_locale_title_key ON public.counterparty_translations USING btree (locale, lower((title)::text));

CREATE UNIQUE INDEX counterparty_names_pkey ON public.counterparty_translations USING btree (counterparty, locale);

alter table "public"."berth_service_translations" add constraint "berth_service_translations_pkey" PRIMARY KEY using index "berth_service_translations_pkey";

alter table "public"."common_service_translations" add constraint "common_service_translations_pkey" PRIMARY KEY using index "common_service_translations_pkey";

alter table "public"."counterparty_translations" add constraint "counterparty_names_pkey" PRIMARY KEY using index "counterparty_names_pkey";

alter table "public"."berth_service_translations" add constraint "berth_service_translations_service_fkey" FOREIGN KEY (berth_service) REFERENCES berth_services(id) ON DELETE CASCADE not valid;

alter table "public"."berth_service_translations" validate constraint "berth_service_translations_service_fkey";

alter table "public"."common_service_translations" add constraint "common_service_translations_service_fkey" FOREIGN KEY (common_service) REFERENCES common_services(id) ON DELETE CASCADE not valid;

alter table "public"."common_service_translations" validate constraint "common_service_translations_service_fkey";

alter table "public"."counterparty_translations" add constraint "counterparty_names_counterparty_fkey" FOREIGN KEY (counterparty) REFERENCES counterparties(business_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."counterparty_translations" validate constraint "counterparty_names_counterparty_fkey";

grant delete on table "public"."berth_service_translations" to "anon";

grant insert on table "public"."berth_service_translations" to "anon";

grant references on table "public"."berth_service_translations" to "anon";

grant select on table "public"."berth_service_translations" to "anon";

grant trigger on table "public"."berth_service_translations" to "anon";

grant truncate on table "public"."berth_service_translations" to "anon";

grant update on table "public"."berth_service_translations" to "anon";

grant delete on table "public"."berth_service_translations" to "authenticated";

grant insert on table "public"."berth_service_translations" to "authenticated";

grant references on table "public"."berth_service_translations" to "authenticated";

grant select on table "public"."berth_service_translations" to "authenticated";

grant trigger on table "public"."berth_service_translations" to "authenticated";

grant truncate on table "public"."berth_service_translations" to "authenticated";

grant update on table "public"."berth_service_translations" to "authenticated";

grant delete on table "public"."berth_service_translations" to "service_role";

grant insert on table "public"."berth_service_translations" to "service_role";

grant references on table "public"."berth_service_translations" to "service_role";

grant select on table "public"."berth_service_translations" to "service_role";

grant trigger on table "public"."berth_service_translations" to "service_role";

grant truncate on table "public"."berth_service_translations" to "service_role";

grant update on table "public"."berth_service_translations" to "service_role";

grant delete on table "public"."common_service_translations" to "anon";

grant insert on table "public"."common_service_translations" to "anon";

grant references on table "public"."common_service_translations" to "anon";

grant select on table "public"."common_service_translations" to "anon";

grant trigger on table "public"."common_service_translations" to "anon";

grant truncate on table "public"."common_service_translations" to "anon";

grant update on table "public"."common_service_translations" to "anon";

grant delete on table "public"."common_service_translations" to "authenticated";

grant insert on table "public"."common_service_translations" to "authenticated";

grant references on table "public"."common_service_translations" to "authenticated";

grant select on table "public"."common_service_translations" to "authenticated";

grant trigger on table "public"."common_service_translations" to "authenticated";

grant truncate on table "public"."common_service_translations" to "authenticated";

grant update on table "public"."common_service_translations" to "authenticated";

grant delete on table "public"."common_service_translations" to "service_role";

grant insert on table "public"."common_service_translations" to "service_role";

grant references on table "public"."common_service_translations" to "service_role";

grant select on table "public"."common_service_translations" to "service_role";

grant trigger on table "public"."common_service_translations" to "service_role";

grant truncate on table "public"."common_service_translations" to "service_role";

grant update on table "public"."common_service_translations" to "service_role";

grant delete on table "public"."counterparty_translations" to "anon";

grant insert on table "public"."counterparty_translations" to "anon";

grant references on table "public"."counterparty_translations" to "anon";

grant select on table "public"."counterparty_translations" to "anon";

grant trigger on table "public"."counterparty_translations" to "anon";

grant truncate on table "public"."counterparty_translations" to "anon";

grant update on table "public"."counterparty_translations" to "anon";

grant delete on table "public"."counterparty_translations" to "authenticated";

grant insert on table "public"."counterparty_translations" to "authenticated";

grant references on table "public"."counterparty_translations" to "authenticated";

grant select on table "public"."counterparty_translations" to "authenticated";

grant trigger on table "public"."counterparty_translations" to "authenticated";

grant truncate on table "public"."counterparty_translations" to "authenticated";

grant update on table "public"."counterparty_translations" to "authenticated";

grant delete on table "public"."counterparty_translations" to "service_role";

grant insert on table "public"."counterparty_translations" to "service_role";

grant references on table "public"."counterparty_translations" to "service_role";

grant select on table "public"."counterparty_translations" to "service_role";

grant trigger on table "public"."counterparty_translations" to "service_role";

grant truncate on table "public"."counterparty_translations" to "service_role";

grant update on table "public"."counterparty_translations" to "service_role";

create policy "Enable delete for authenticated users only"
on "public"."counterparty_translations"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."counterparty_translations"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."counterparty_translations"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."counterparty_translations"
as permissive
for update
to authenticated
with check (true);



