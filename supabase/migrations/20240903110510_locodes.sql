create table "public"."locodes" (
    "locode" text not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."locodes" enable row level security;

CREATE UNIQUE INDEX locodes_pkey ON public.locodes USING btree (locode);

alter table "public"."locodes" add constraint "locodes_pkey" PRIMARY KEY using index "locodes_pkey";

grant delete on table "public"."locodes" to "anon";

grant insert on table "public"."locodes" to "anon";

grant references on table "public"."locodes" to "anon";

grant select on table "public"."locodes" to "anon";

grant trigger on table "public"."locodes" to "anon";

grant truncate on table "public"."locodes" to "anon";

grant update on table "public"."locodes" to "anon";

grant delete on table "public"."locodes" to "authenticated";

grant insert on table "public"."locodes" to "authenticated";

grant references on table "public"."locodes" to "authenticated";

grant select on table "public"."locodes" to "authenticated";

grant trigger on table "public"."locodes" to "authenticated";

grant truncate on table "public"."locodes" to "authenticated";

grant update on table "public"."locodes" to "authenticated";

grant delete on table "public"."locodes" to "service_role";

grant insert on table "public"."locodes" to "service_role";

grant references on table "public"."locodes" to "service_role";

grant select on table "public"."locodes" to "service_role";

grant trigger on table "public"."locodes" to "service_role";

grant truncate on table "public"."locodes" to "service_role";

grant update on table "public"."locodes" to "service_role";

create policy "Enable delete for authenticated users only"
on "public"."locodes"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."locodes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."locodes"
as permissive
for select
to authenticated
using (true);



