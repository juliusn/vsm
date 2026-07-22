export const commonServicesSelector = `
id,
sort_order,
port_event,
translations:common_service_translations!inner(locale, title, abbreviation)`;

const portEventsSelector = `
id,
created_at,
type,
estimated_date,
estimated_time,
locode,
port_area_code,
berth_code,
position
`;

const baseBerthingsSelector = `
id, 
created_at, 
vessel_imo, 
vessel_name, 
arrival:port_events!arrival (${portEventsSelector}),
departure:port_events!departure (${portEventsSelector}),
shiftings:berthing_shiftings (
  port_event:port_events (${portEventsSelector})
)
`;

export const berthingsSelector = `
${baseBerthingsSelector},
order:orders!orders_berthing_fkey (
  id
)
`;

export const ordersSelector = `
id,
created_at,
status,
berthing:berthings (${baseBerthingsSelector}),
common_services (${commonServicesSelector}),
sender:counterparties!orders_sender_fkey (
  business_id,
  name,
  translations:counterparty_translations!inner(
    locale,
    title
  )
),
receiver:counterparties!orders_receiver_fkey (
  business_id,
  name,
  translations:counterparty_translations!inner(
    locale,
    title
  )
)
`;

export const counterpartiesSelector = `
business_id,
name,
translations:counterparty_translations!inner(
  locale,
  title
)
`;

export const berthServicesSelector = `
id,
locode,
port_area_code,
berth_code,
enabled,
sort_order,
port_event,
translations:berth_service_translations!inner(locale, title, abbreviation)
`;

export const orderPermissionsSelector = `
id,
user_id,
order_permission,
sender:counterparties!order_permissions_sender_counterparty_business_id_fkey (${counterpartiesSelector}),
receiver:counterparties!order_permissions_receiver_counterparty_business_id_fkey (${counterpartiesSelector})
`;

export const profileSelector = `
  id,
  updated_at,
  first_name,
  last_name,
  approval_status,
  approval_status_set_by,
  admin,
  order_permissions:order_permissions (${orderPermissionsSelector})
`;
