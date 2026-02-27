alter table "public"."common_services" add constraint "common_services_sort_order_not_null" CHECK ((sort_order IS NOT NULL)) not valid;

alter table "public"."common_services" validate constraint "common_services_sort_order_not_null";

alter table "public"."order_permissions" add constraint "order_permissions_user_id_fkey1" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."order_permissions" validate constraint "order_permissions_user_id_fkey1";


  create policy "Allow admin users to do anything"
  on "public"."order_permissions"
  as permissive
  for all
  to authenticated
using (public.is_admin())
with check (public.is_admin());



