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
common_services ( id, titles )
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
