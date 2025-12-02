drop extension if exists "pg_jsonschema";

drop extension if exists "pg_net";

drop extension if exists "pg_stat_statements";

drop extension if exists "pgcrypto";

drop extension if exists "pgjwt";

drop extension if exists "uuid-ossp";

create type "public"."app_permission" as enum ('orders.read', 'orders.create', 'orders.delete', 'orders.mark_received', 'orders.mark_completed', 'orders.mark_canceled');

drop policy "Enable delete for authenticated users only" on "public"."orders";

drop policy "Enable insert for authenticated users only" on "public"."orders";

drop policy "Enable select for authenticated users only" on "public"."orders";

drop policy "Enable update for authenticated users only" on "public"."orders";

alter table "public"."profiles" drop constraint "profiles_username_key";

alter table "public"."orders" drop constraint "orders_receiver_fkey";

alter table "public"."orders" drop constraint "orders_sender_fkey";

drop index if exists "public"."profiles_username_key";

alter table "public"."orders" alter column "status" drop default;

alter type "public"."order_status" rename to "order_status__old_version_to_be_dropped";

create type "public"."order_status" as enum ('submitted', 'received', 'completed', 'canceled');


  create table "public"."user_order_scopes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "app_permission" public.app_permission not null,
    "sender_counterparty_business_id" character varying not null,
    "receiver_counterparty_business_id" character varying not null
      );


alter table "public"."user_order_scopes" enable row level security;

alter table "public"."orders" alter column status type "public"."order_status" using status::text::"public"."order_status";

alter table "public"."orders" alter column "status" set default 'submitted'::public.order_status;

drop type "public"."order_status__old_version_to_be_dropped";

alter table "public"."berth_service_translations" enable row level security;

alter table "public"."common_service_translations" enable row level security;

alter table "public"."orders" drop column "receiver";

alter table "public"."orders" drop column "sender";

alter table "public"."orders" add column "receiver_counterparty_business_id" character varying not null;

alter table "public"."orders" add column "sender_counterparty_business_id" character varying not null;

CREATE UNIQUE INDEX user_order_scopes_pkey ON public.user_order_scopes USING btree (id);

CREATE UNIQUE INDEX user_order_scopes_unique_scope ON public.user_order_scopes USING btree (user_id, app_permission, sender_counterparty_business_id, receiver_counterparty_business_id);

alter table "public"."user_order_scopes" add constraint "user_order_scopes_pkey" PRIMARY KEY using index "user_order_scopes_pkey";

alter table "public"."user_order_scopes" add constraint "user_order_scopes_receiver_counterparty_id_fkey" FOREIGN KEY (receiver_counterparty_business_id) REFERENCES public.counterparties(business_id) ON DELETE CASCADE not valid;

alter table "public"."user_order_scopes" validate constraint "user_order_scopes_receiver_counterparty_id_fkey";

alter table "public"."user_order_scopes" add constraint "user_order_scopes_sender_counterparty_id_fkey" FOREIGN KEY (sender_counterparty_business_id) REFERENCES public.counterparties(business_id) ON DELETE CASCADE not valid;

alter table "public"."user_order_scopes" validate constraint "user_order_scopes_sender_counterparty_id_fkey";

alter table "public"."user_order_scopes" add constraint "user_order_scopes_unique_scope" UNIQUE using index "user_order_scopes_unique_scope";

alter table "public"."user_order_scopes" add constraint "user_order_scopes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_order_scopes" validate constraint "user_order_scopes_user_id_fkey";

alter table "public"."orders" add constraint "orders_receiver_fkey" FOREIGN KEY (receiver_counterparty_business_id) REFERENCES public.counterparties(business_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."orders" validate constraint "orders_receiver_fkey";

alter table "public"."orders" add constraint "orders_sender_fkey" FOREIGN KEY (sender_counterparty_business_id) REFERENCES public.counterparties(business_id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."orders" validate constraint "orders_sender_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize_orders(requested_permission public.app_permission, sender_business_id character varying, receiver_business_id character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
return exists (
  select 1
  from public.user_order_scopes scope
  where scope.user_id = auth.uid()
  and scope.app_permission = requested_permission
  and scope.sender_counterparty_id = sender_business_id
  and scope.receiver_counterparty_id = receiver_business_id
);
end;
$function$
;

CREATE OR REPLACE FUNCTION public.orders_mark_canceled(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
update public.orders o
set order_status = 'canceled'
where o.id = p_order_id
and public.authorize_orders(
  'orders.mark_canceled',
  o.sender_counterparty_business_id,
  o.receiver_counterparty_business_id
);
if not found then
raise exception 'Not authorized';
end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.orders_mark_completed(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
update public.orders o
set order_status = 'completed'
where o.id = p_order_id
and public.authorize_orders(
  'orders.mark_completed',
  o.sender_counterparty_business_id,
  o.receiver_counterparty_business_id
);
if not found then
raise exception 'Not authorized';
end if;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.orders_mark_received(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
update public.orders o
set order_status = 'received'
where o.id = p_order_id
and public.authorize_orders(
  'orders.mark_received',
  o.sender_counterparty_business_id,
  o.receiver_counterparty_business_id
);
if not found then
raise exception 'Not authorized';
end if;
end;$function$
;

grant delete on table "public"."user_order_scopes" to "anon";

grant insert on table "public"."user_order_scopes" to "anon";

grant references on table "public"."user_order_scopes" to "anon";

grant select on table "public"."user_order_scopes" to "anon";

grant trigger on table "public"."user_order_scopes" to "anon";

grant truncate on table "public"."user_order_scopes" to "anon";

grant update on table "public"."user_order_scopes" to "anon";

grant delete on table "public"."user_order_scopes" to "authenticated";

grant insert on table "public"."user_order_scopes" to "authenticated";

grant references on table "public"."user_order_scopes" to "authenticated";

grant select on table "public"."user_order_scopes" to "authenticated";

grant trigger on table "public"."user_order_scopes" to "authenticated";

grant truncate on table "public"."user_order_scopes" to "authenticated";

grant update on table "public"."user_order_scopes" to "authenticated";

grant delete on table "public"."user_order_scopes" to "postgres";

grant insert on table "public"."user_order_scopes" to "postgres";

grant references on table "public"."user_order_scopes" to "postgres";

grant select on table "public"."user_order_scopes" to "postgres";

grant trigger on table "public"."user_order_scopes" to "postgres";

grant truncate on table "public"."user_order_scopes" to "postgres";

grant update on table "public"."user_order_scopes" to "postgres";

grant delete on table "public"."user_order_scopes" to "service_role";

grant insert on table "public"."user_order_scopes" to "service_role";

grant references on table "public"."user_order_scopes" to "service_role";

grant select on table "public"."user_order_scopes" to "service_role";

grant trigger on table "public"."user_order_scopes" to "service_role";

grant truncate on table "public"."user_order_scopes" to "service_role";

grant update on table "public"."user_order_scopes" to "service_role";


  create policy "Enable delete for authenticated users only"
  on "public"."berth_service_translations"
  as permissive
  for delete
  to authenticated
using (true);



  create policy "Enable insert for authenticated users only"
  on "public"."berth_service_translations"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable select for authenticated users only"
  on "public"."berth_service_translations"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable update for authenticated users only"
  on "public"."berth_service_translations"
  as permissive
  for update
  to authenticated
using (true);



  create policy "Enable all for authenticated users only"
  on "public"."common_service_translations"
  as permissive
  for all
  to authenticated
using (true);



  create policy "orders_create_scoped"
  on "public"."orders"
  as permissive
  for insert
  to authenticated
with check (public.authorize_orders('orders.create'::public.app_permission, sender_counterparty_business_id, receiver_counterparty_business_id));



  create policy "orders_delete_scoped"
  on "public"."orders"
  as permissive
  for delete
  to authenticated
using (public.authorize_orders('orders.delete'::public.app_permission, sender_counterparty_business_id, receiver_counterparty_business_id));



  create policy "orders_read_scoped"
  on "public"."orders"
  as permissive
  for select
  to authenticated
using (public.authorize_orders('orders.read'::public.app_permission, sender_counterparty_business_id, receiver_counterparty_business_id));



