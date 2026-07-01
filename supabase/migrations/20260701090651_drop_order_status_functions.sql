drop function if exists "public"."orders_mark_canceled"(p_order_id uuid);

drop function if exists "public"."orders_mark_completed"(p_order_id uuid);

drop function if exists "public"."orders_mark_received"(p_order_id uuid);

alter table "public"."orders" disable row level security;


