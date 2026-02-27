export const commonServicesSelector = `
id,
sort_order,
translations:common_service_translations!inner(locale, title, abbreviation)`;

const baseBerthingsSelector = `
id, 
created_at, 
vessel_imo, 
vessel_name, 
arrival:port_events!arrival (
  id, 
  created_at, 
  type, 
  estimated_date, 
  estimated_time, 
  locode, 
  port_area_code, 
  berth_code,
  position
),
departure:port_events!departure (
  id, 
  created_at, 
  type, 
  estimated_date, 
  estimated_time, 
  locode, 
  port_area_code, 
  berth_code,
  position
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
