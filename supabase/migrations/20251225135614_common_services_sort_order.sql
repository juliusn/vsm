alter table "public"."common_services" add column "sort_order" integer;

CREATE UNIQUE INDEX common_services_sort_order_key ON public.common_services USING btree (sort_order);

alter table "public"."common_services" add constraint "common_services_sort_order_key" UNIQUE using index "common_services_sort_order_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_sort_order()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  next_order integer;
begin
  if new.sort_order is null then
    execute format(
      'lock table %I.%I in share row exclusive mode',
      tg_table_schema, tg_table_name
    );

    execute format(
      'select coalesce(max(sort_order), -1) + 1 from %I.%I',
      tg_table_schema, tg_table_name
    )
    into next_order;

    new.sort_order := next_order;
  end if;
  return new;
  end;
$function$
;

CREATE OR REPLACE FUNCTION public.authorize_orders(requested_permission public.order_permission, sender_business_id character varying, receiver_business_id character varying)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$begin

if auth.jwt()->>'approval_status' <> 'approved' then
  return false;
end if;

return exists (
  select 1
  from public.order_permissions permission
  where permission.user_id = auth.uid()
  and permission.order_permission = requested_permission
  and permission.sender_counterparty_business_id = sender_business_id
  and permission.receiver_counterparty_business_id = receiver_business_id
);
end;$function$
;

CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE
 SET search_path TO ''
AS $function$
  declare
    claims jsonb;
    status public.approval_status;
  begin
    select approval_status into status from public.profiles where id = (event->>'user_id')::uuid;
    claims := event->'claims';
    if status is not null then
      claims := jsonb_set(claims, '{approval_status}', to_jsonb(status));
    else
      claims := jsonb_set(claims, '{approval_status}', 'null');
    end if;
    event := jsonb_set(event, '{claims}', claims);
    return event;
  end;
$function$
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

grant delete on table "public"."order_permissions" to "postgres";

grant insert on table "public"."order_permissions" to "postgres";

grant references on table "public"."order_permissions" to "postgres";

grant select on table "public"."order_permissions" to "postgres";

grant trigger on table "public"."order_permissions" to "postgres";

grant truncate on table "public"."order_permissions" to "postgres";

grant update on table "public"."order_permissions" to "postgres";


  create policy "Authorize cancel"
  on "public"."orders"
  as permissive
  for update
  to authenticated
using (public.authorize_orders('mark_canceled'::public.order_permission, sender_counterparty_business_id, receiver_counterparty_business_id));



  create policy "Authorize complete"
  on "public"."orders"
  as permissive
  for update
  to authenticated
using (public.authorize_orders('mark_completed'::public.order_permission, sender_counterparty_business_id, receiver_counterparty_business_id));



  create policy "Authorize receive"
  on "public"."orders"
  as permissive
  for update
  to authenticated
using (public.authorize_orders('mark_received'::public.order_permission, sender_counterparty_business_id, receiver_counterparty_business_id));


CREATE TRIGGER common_services_insert_trigger BEFORE INSERT ON public.common_services FOR EACH ROW EXECUTE FUNCTION public.set_sort_order();


