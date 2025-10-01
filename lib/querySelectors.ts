export const ordersSelector = `
id,
created_at,
status,
berthing:berthings (
  id, 
  created_at, 
  vessel_imo, 
  vessel_name, 
  locode, 
  port_area_code, 
  berth_code, 
  port_events ( 
    id, 
    created_at, 
    type, 
    estimated_date, 
    estimated_time 
  )
),
common_services (
  id,
  translations:common_service_translations!inner(
    locale, 
    title, 
    abbreviation
  )
),
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

export const berthingsSelector = `
id, 
created_at, 
vessel_imo, 
vessel_name, 
locode, 
port_area_code, 
berth_code, 
port_events ( 
  id, 
  created_at, 
  type, 
  estimated_date, 
  estimated_time 
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

export const commonServicesSelector = `
id,
translations:common_service_translations!inner(locale, title, abbreviation)`;

export const berthServicesSelector = `
id,
locode,
port_area_code,
berth_code,
enabled,
translations:berth_service_translations!inner(locale, title, abbreviation)
`;
