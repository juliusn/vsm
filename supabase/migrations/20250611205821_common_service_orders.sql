create table "public"."common_service_order" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "common_service" uuid not null,
    "order" uuid not null
);


alter table "public"."common_service_order" enable row level security;

alter table "public"."orders" drop column "service_titles";

alter table "public"."orders" drop column "time";

alter table "public"."orders" drop column "vessel_imo";

alter table "public"."orders" add column "docking" uuid not null;

CREATE UNIQUE INDEX common_service_order_pkey ON public.common_service_order USING btree (id);

CREATE UNIQUE INDEX orders_docking_key ON public.orders USING btree (docking);

CREATE UNIQUE INDEX unique_common_service_order ON public.common_service_order USING btree ("order", common_service);

alter table "public"."common_service_order" add constraint "common_service_order_pkey" PRIMARY KEY using index "common_service_order_pkey";

alter table "public"."common_service_order" add constraint "common_service_order_common_service_fkey" FOREIGN KEY (common_service) REFERENCES common_services(id) ON DELETE CASCADE not valid;

alter table "public"."common_service_order" validate constraint "common_service_order_common_service_fkey";

alter table "public"."common_service_order" add constraint "common_service_order_order_fkey" FOREIGN KEY ("order") REFERENCES orders(id) ON DELETE CASCADE not valid;

alter table "public"."common_service_order" validate constraint "common_service_order_order_fkey";

alter table "public"."common_service_order" add constraint "unique_common_service_order" UNIQUE using index "unique_common_service_order";

alter table "public"."orders" add constraint "orders_docking_fkey" FOREIGN KEY (docking) REFERENCES dockings(id) not valid;

alter table "public"."orders" validate constraint "orders_docking_fkey";

alter table "public"."orders" add constraint "orders_docking_key" UNIQUE using index "orders_docking_key";

grant delete on table "public"."common_service_order" to "anon";

grant insert on table "public"."common_service_order" to "anon";

grant references on table "public"."common_service_order" to "anon";

grant select on table "public"."common_service_order" to "anon";

grant trigger on table "public"."common_service_order" to "anon";

grant truncate on table "public"."common_service_order" to "anon";

grant update on table "public"."common_service_order" to "anon";

grant delete on table "public"."common_service_order" to "authenticated";

grant insert on table "public"."common_service_order" to "authenticated";

grant references on table "public"."common_service_order" to "authenticated";

grant select on table "public"."common_service_order" to "authenticated";

grant trigger on table "public"."common_service_order" to "authenticated";

grant truncate on table "public"."common_service_order" to "authenticated";

grant update on table "public"."common_service_order" to "authenticated";

grant delete on table "public"."common_service_order" to "service_role";

grant insert on table "public"."common_service_order" to "service_role";

grant references on table "public"."common_service_order" to "service_role";

grant select on table "public"."common_service_order" to "service_role";

grant trigger on table "public"."common_service_order" to "service_role";

grant truncate on table "public"."common_service_order" to "service_role";

grant update on table "public"."common_service_order" to "service_role";

create policy "Enable all for authenticated users only"
on "public"."common_service_order"
as permissive
for all
to authenticated
using (true)
with check (true);



