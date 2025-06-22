alter table "public"."port_events" drop constraint "docking_events_pkey";

alter table "public"."common_service_order" drop constraint "common_service_order_pkey";

drop index if exists "public"."docking_events_pkey";

drop index if exists "public"."common_service_order_pkey";

CREATE UNIQUE INDEX port_events_pkey ON public.port_events USING btree (id);

CREATE UNIQUE INDEX common_service_order_pkey ON public.common_service_order USING btree (common_service, "order");

alter table "public"."port_events" add constraint "port_events_pkey" PRIMARY KEY using index "port_events_pkey";

alter table "public"."common_service_order" add constraint "common_service_order_pkey" PRIMARY KEY using index "common_service_order_pkey";


