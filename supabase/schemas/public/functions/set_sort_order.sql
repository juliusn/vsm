CREATE OR REPLACE FUNCTION public.set_sort_order()
  RETURNS TRIGGER
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
$function$;

REVOKE ALL ON FUNCTION "public"."set_sort_order"() FROM "postgres";

GRANT EXECUTE ON FUNCTION "public"."set_sort_order"() TO "postgres";

REVOKE ALL ON FUNCTION "public"."set_sort_order"() FROM PUBLIC, "anon", "authenticated", "service_role";
