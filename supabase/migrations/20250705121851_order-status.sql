create type "public"."order_status" as enum ('submitted', 'received', 'completed', 'cancelled');

alter table "public"."orders" add column "status" order_status not null default 'submitted'::order_status;


