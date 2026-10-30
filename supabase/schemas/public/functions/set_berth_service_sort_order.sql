CREATE OR REPLACE FUNCTION public.set_berth_service_sort_order()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $function$
declare
  next_order integer;
begin
  if new.sort_order is null or new.sort_order = -1 then
    lock table public.berth_services
      in share row exclusive mode;

    select coalesce(max(sort_order), -1) + 1
    into next_order
    from public.berth_services
    where locode = new.locode
      and port_area_code = new.port_area_code
      and berth_code = new.berth_code;

    new.sort_order := next_order;
  end if;

  return new;
end;
$function$;

REVOKE ALL ON FUNCTION "public"."set_berth_service_sort_order"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_berth_service_sort_order"() TO "postgres";

REVOKE ALL ON FUNCTION "public"."set_berth_service_sort_order"() FROM PUBLIC, "anon", "authenticated", "service_role";
