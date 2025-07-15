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
common_services ( id, titles ),
sender:counterparties!orders_sender_fkey (
  business_id,
  name,
  counterparty_names (
    locale,
    name
  )
),
receiver:counterparties!orders_receiver_fkey (
  business_id,
  name,
  counterparty_names (
    locale,
    name
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
counterparty_names (
  locale,
  name
)
`;
