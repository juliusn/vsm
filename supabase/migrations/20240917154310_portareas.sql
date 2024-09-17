create table "public"."port-area-codes" (
    "port-area-code" text not null
);


alter table "public"."port-area-codes" enable row level security;

CREATE UNIQUE INDEX "port-area-codes_pkey" ON public."port-area-codes" USING btree ("port-area-code");

alter table "public"."port-area-codes" add constraint "port-area-codes_pkey" PRIMARY KEY using index "port-area-codes_pkey";

grant delete on table "public"."port-area-codes" to "anon";

grant insert on table "public"."port-area-codes" to "anon";

grant references on table "public"."port-area-codes" to "anon";

grant select on table "public"."port-area-codes" to "anon";

grant trigger on table "public"."port-area-codes" to "anon";

grant truncate on table "public"."port-area-codes" to "anon";

grant update on table "public"."port-area-codes" to "anon";

grant delete on table "public"."port-area-codes" to "authenticated";

grant insert on table "public"."port-area-codes" to "authenticated";

grant references on table "public"."port-area-codes" to "authenticated";

grant select on table "public"."port-area-codes" to "authenticated";

grant trigger on table "public"."port-area-codes" to "authenticated";

grant truncate on table "public"."port-area-codes" to "authenticated";

grant update on table "public"."port-area-codes" to "authenticated";

grant delete on table "public"."port-area-codes" to "service_role";

grant insert on table "public"."port-area-codes" to "service_role";

grant references on table "public"."port-area-codes" to "service_role";

grant select on table "public"."port-area-codes" to "service_role";

grant trigger on table "public"."port-area-codes" to "service_role";

grant truncate on table "public"."port-area-codes" to "service_role";

grant update on table "public"."port-area-codes" to "service_role";

create policy "Enable delete for authenticated users only"
on "public"."port-area-codes"
as permissive
for delete
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."port-area-codes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."port-area-codes"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for authenticated users only"
on "public"."port-area-codes"
as permissive
for update
to authenticated
using (true);



