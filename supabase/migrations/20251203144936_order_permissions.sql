create type "public"."order_permission" as enum ('read', 'create', 'edit', 'delete');

drop policy "orders_create_scoped" on "public"."orders";

drop policy "orders_delete_scoped" on "public"."orders";

drop policy "orders_read_scoped" on "public"."orders";

revoke delete on table "public"."user_order_scopes" from "anon";

revoke insert on table "public"."user_order_scopes" from "anon";

revoke references on table "public"."user_order_scopes" from "anon";

revoke select on table "public"."user_order_scopes" from "anon";

revoke trigger on table "public"."user_order_scopes" from "anon";

revoke truncate on table "public"."user_order_scopes" from "anon";

revoke update on table "public"."user_order_scopes" from "anon";

revoke delete on table "public"."user_order_scopes" from "authenticated";

revoke insert on table "public"."user_order_scopes" from "authenticated";

revoke references on table "public"."user_order_scopes" from "authenticated";

revoke select on table "public"."user_order_scopes" from "authenticated";

revoke trigger on table "public"."user_order_scopes" from "authenticated";

revoke truncate on table "public"."user_order_scopes" from "authenticated";

revoke update on table "public"."user_order_scopes" from "authenticated";

revoke delete on table "public"."user_order_scopes" from "service_role";

revoke insert on table "public"."user_order_scopes" from "service_role";

revoke references on table "public"."user_order_scopes" from "service_role";

revoke select on table "public"."user_order_scopes" from "service_role";

revoke trigger on table "public"."user_order_scopes" from "service_role";

revoke truncate on table "public"."user_order_scopes" from "service_role";

revoke update on table "public"."user_order_scopes" from "service_role";

alter table "public"."user_order_scopes" drop constraint "user_order_scopes_receiver_counterparty_id_fkey";

alter table "public"."user_order_scopes" drop constraint "user_order_scopes_sender_counterparty_id_fkey";

alter table "public"."user_order_scopes" drop constraint "user_order_scopes_unique_scope";

alter table "public"."user_order_scopes" drop constraint "user_order_scopes_user_id_fkey";

drop function if exists "public"."authorize_orders"(requested_permission public.app_permission, sender_business_id character varying, receiver_business_id character varying);

alter table "public"."user_order_scopes" drop constraint "user_order_scopes_pkey";

drop index if exists "public"."user_order_scopes_pkey";

drop index if exists "public"."user_order_scopes_unique_scope";

drop table "public"."user_order_scopes";


  create table "public"."order_permissions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "order_permission" public.order_permission not null,
    "sender_counterparty_business_id" character varying not null,
    "receiver_counterparty_business_id" character varying not null
      );


alter table "public"."order_permissions" enable row level security;

drop type "public"."app_permission";

CREATE UNIQUE INDEX user_order_scopes_pkey ON public.order_permissions USING btree (id);

CREATE UNIQUE INDEX user_order_scopes_unique_scope ON public.order_permissions USING btree (user_id, order_permission, sender_counterparty_business_id, receiver_counterparty_business_id);

alter table "public"."order_permissions" add constraint "user_order_scopes_pkey" PRIMARY KEY using index "user_order_scopes_pkey";

alter table "public"."order_permissions" add constraint "order_permissions_receiver_counterparty_business_id_fkey" FOREIGN KEY (receiver_counterparty_business_id) REFERENCES public.counterparties(business_id) ON DELETE CASCADE not valid;

alter table "public"."order_permissions" validate constraint "order_permissions_receiver_counterparty_business_id_fkey";

alter table "public"."order_permissions" add constraint "order_permissions_sender_counterparty_business_id_fkey" FOREIGN KEY (sender_counterparty_business_id) REFERENCES public.counterparties(business_id) ON DELETE CASCADE not valid;

alter table "public"."order_permissions" validate constraint "order_permissions_sender_counterparty_business_id_fkey";

alter table "public"."order_permissions" add constraint "order_permissions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."order_permissions" validate constraint "order_permissions_user_id_fkey";

alter table "public"."order_permissions" add constraint "user_order_scopes_unique_scope" UNIQUE using index "user_order_scopes_unique_scope";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.authorize_orders(requested_permission public.order_permission, sender_business_id character varying, receiver_business_id character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
return exists (
  select 1
  from public.order_permissions permission
  where scope.user_id = auth.uid()
  and permission.order_permission = requested_permission
  and permission.sender_counterparty_business_id = sender_business_id
  and permission.receiver_counterparty_business_id = receiver_business_id
);
end;$function$
;

CREATE OR REPLACE FUNCTION public.orders_mark_canceled(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
update public.orders o
set order_status = 'canceled'
where o.id = p_order_id
and public.authorize_orders(
  'mark_canceled',
  o.sender_counterparty_business_id,
  o.receiver_counterparty_business_id
);
if not found then
raise exception 'Not authorized';
end if;
end;$function$
;

CREATE OR REPLACE FUNCTION public.orders_mark_completed(p_order_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$begin
update public.orders o
set order_status = 'completed'
where o.id = p_order_id
and public.authorize_orders(
  'mark_completed',
  o.sender_counterparty_business_id,
  o.receiver_counterparty_business_id
);
if not found then
raise exception 'Not authorized';
end if;
end;$function$
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
  'mark_received',
  o.sender_counterparty_business_id,
  o.receiver_counterparty_business_id
);
if not found then
raise exception 'Not authorized';
end if;
end;$function$
;

grant delete on table "public"."order_permissions" to "anon";

grant insert on table "public"."order_permissions" to "anon";

grant references on table "public"."order_permissions" to "anon";

grant select on table "public"."order_permissions" to "anon";

grant trigger on table "public"."order_permissions" to "anon";

grant truncate on table "public"."order_permissions" to "anon";

grant update on table "public"."order_permissions" to "anon";

grant delete on table "public"."order_permissions" to "authenticated";

grant insert on table "public"."order_permissions" to "authenticated";

grant references on table "public"."order_permissions" to "authenticated";

grant select on table "public"."order_permissions" to "authenticated";

grant trigger on table "public"."order_permissions" to "authenticated";

grant truncate on table "public"."order_permissions" to "authenticated";

grant update on table "public"."order_permissions" to "authenticated";

grant delete on table "public"."order_permissions" to "postgres";

grant insert on table "public"."order_permissions" to "postgres";

grant references on table "public"."order_permissions" to "postgres";

grant select on table "public"."order_permissions" to "postgres";

grant trigger on table "public"."order_permissions" to "postgres";

grant truncate on table "public"."order_permissions" to "postgres";

grant update on table "public"."order_permissions" to "postgres";

grant delete on table "public"."order_permissions" to "service_role";

grant insert on table "public"."order_permissions" to "service_role";

grant references on table "public"."order_permissions" to "service_role";

grant select on table "public"."order_permissions" to "service_role";

grant trigger on table "public"."order_permissions" to "service_role";

grant truncate on table "public"."order_permissions" to "service_role";

grant update on table "public"."order_permissions" to "service_role";


  create policy "Enable users to view their own data only"
  on "public"."order_permissions"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Authorize create"
  on "public"."orders"
  as permissive
  for insert
  to authenticated
with check (public.authorize_orders('create'::public.order_permission, sender_counterparty_business_id, receiver_counterparty_business_id));



  create policy "Authorize delete"
  on "public"."orders"
  as permissive
  for delete
  to authenticated
using (public.authorize_orders('delete'::public.order_permission, sender_counterparty_business_id, receiver_counterparty_business_id));



  create policy "Authorize read"
  on "public"."orders"
  as permissive
  for select
  to authenticated
using (public.authorize_orders('read'::public.order_permission, sender_counterparty_business_id, receiver_counterparty_business_id));



