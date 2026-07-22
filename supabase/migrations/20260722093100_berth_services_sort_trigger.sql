drop trigger if exists berth_services_insert_trigger
on public.berth_services;

create or replace function public.set_berth_service_sort_order()
returns trigger
language plpgsql
as $$
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
$$;

with ordered_services as (
  select
    id,
    row_number() over (
      partition by locode, port_area_code, berth_code
      order by sort_order nulls last, id
    ) - 1 as new_sort_order
  from public.berth_services
)
update public.berth_services as service
set sort_order = ordered.new_sort_order
from ordered_services as ordered
where service.id = ordered.id;

alter table public.berth_services
alter column sort_order set not null;

alter table public.berth_services
alter column sort_order set default -1;

alter table public.berth_services
drop constraint if exists berth_services_berth_sort_order_key;

alter table public.berth_services
add constraint berth_services_berth_sort_order_key
unique (locode, port_area_code, berth_code, sort_order)
deferrable initially deferred;

create trigger berth_services_insert_trigger
before insert on public.berth_services
for each row
execute function public.set_berth_service_sort_order();
