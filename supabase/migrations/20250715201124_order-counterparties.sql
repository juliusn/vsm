create type "public"."approval_status" as enum ('pending', 'approved', 'rejected');

create type "public"."locale" as enum ('en', 'fi');

create type "public"."port_event" as enum ('arrival', 'departure', 'shifting');

create table "public"."counterparties" (
    "business_id" character varying(9) not null,
    "created_at" timestamp with time zone not null default now(),
    "name" character varying not null
);


alter table "public"."counterparties" enable row level security;

create table "public"."counterparty_names" (
    "counterparty" character varying not null,
    "locale" locale not null,
    "created_at" timestamp with time zone not null default now(),
    "name" character varying not null
);


alter table "public"."counterparty_names" enable row level security;

alter table "public"."orders" add column "receiver" character varying not null;

alter table "public"."orders" add column "sender" character varying not null;

alter table "public"."port_events" alter column "type" set data type port_event using "type"::text::port_event;

alter table "public"."profiles" alter column "approval_status" drop default;

alter table "public"."profiles" alter column "approval_status" set data type approval_status using "approval_status"::text::approval_status;

alter table "public"."profiles" alter column "approval_status" set default 'pending'::approval_status;

drop type "public"."approval_status_enum";

drop type "public"."port_event_enum";

CREATE UNIQUE INDEX counterparties_pkey ON public.counterparties USING btree (business_id);

CREATE UNIQUE INDEX counterparty_names_pkey ON public.counterparty_names USING btree (counterparty, locale);

alter table "public"."counterparties" add constraint "counterparties_pkey" PRIMARY KEY using index "counterparties_pkey";

alter table "public"."counterparty_names" add constraint "counterparty_names_pkey" PRIMARY KEY using index "counterparty_names_pkey";

alter table "public"."counterparty_names" add constraint "counterparty_names_counterparty_fkey" FOREIGN KEY (counterparty) REFERENCES counterparties(business_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."counterparty_names" validate constraint "counterparty_names_counterparty_fkey";

alter table "public"."orders" add constraint "orders_receiver_fkey" FOREIGN KEY (receiver) REFERENCES counterparties(business_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."orders" validate constraint "orders_receiver_fkey";

alter table "public"."orders" add constraint "orders_sender_fkey" FOREIGN KEY (sender) REFERENCES counterparties(business_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."orders" validate constraint "orders_sender_fkey";

grant delete on table "public"."counterparties" to "anon";

grant insert on table "public"."counterparties" to "anon";

grant references on table "public"."counterparties" to "anon";

grant select on table "public"."counterparties" to "anon";

grant trigger on table "public"."counterparties" to "anon";

grant truncate on table "public"."counterparties" to "anon";

grant update on table "public"."counterparties" to "anon";

grant delete on table "public"."counterparties" to "authenticated";

grant insert on table "public"."counterparties" to "authenticated";

grant references on table "public"."counterparties" to "authenticated";

grant select on table "public"."counterparties" to "authenticated";

grant trigger on table "public"."counterparties" to "authenticated";

grant truncate on table "public"."counterparties" to "authenticated";

grant update on table "public"."counterparties" to "authenticated";

grant delete on table "public"."counterparties" to "service_role";

grant insert on table "public"."counterparties" to "service_role";

grant references on table "public"."counterparties" to "service_role";

grant select on table "public"."counterparties" to "service_role";

grant trigger on table "public"."counterparties" to "service_role";

grant truncate on table "public"."counterparties" to "service_role";

grant update on table "public"."counterparties" to "service_role";

grant delete on table "public"."counterparty_names" to "anon";

grant insert on table "public"."counterparty_names" to "anon";

grant references on table "public"."counterparty_names" to "anon";

grant select on table "public"."counterparty_names" to "anon";

grant trigger on table "public"."counterparty_names" to "anon";

grant truncate on table "public"."counterparty_names" to "anon";

grant update on table "public"."counterparty_names" to "anon";

grant delete on table "public"."counterparty_names" to "authenticated";

grant insert on table "public"."counterparty_names" to "authenticated";

grant references on table "public"."counterparty_names" to "authenticated";

grant select on table "public"."counterparty_names" to "authenticated";

grant trigger on table "public"."counterparty_names" to "authenticated";

grant truncate on table "public"."counterparty_names" to "authenticated";

grant update on table "public"."counterparty_names" to "authenticated";

grant delete on table "public"."counterparty_names" to "service_role";

grant insert on table "public"."counterparty_names" to "service_role";

grant references on table "public"."counterparty_names" to "service_role";

grant select on table "public"."counterparty_names" to "service_role";

grant trigger on table "public"."counterparty_names" to "service_role";

grant truncate on table "public"."counterparty_names" to "service_role";

grant update on table "public"."counterparty_names" to "service_role";

create policy "Enable delete for authenticated users only"
on "public"."counterparties"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."counterparties"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."counterparties"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."counterparties"
as permissive
for update
to authenticated
with check (true);


create policy "Enable delete for authenticated users only"
on "public"."counterparty_names"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."counterparty_names"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."counterparty_names"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."counterparty_names"
as permissive
for update
to authenticated
with check (true);



