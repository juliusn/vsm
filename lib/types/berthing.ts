export interface BerthingFormValues {
  vesselName: string;
  imo: number | '';
  locode: string;
  portArea: string;
  berth: string;
  etaDate: Date | '';
  etaTime: string;
  etdDate: Date | '';
  etdTime: string;
}

export type PortAreaIdentifier = {
  locode: string;
  port_area_code: string;
};

export type BerthIdentifier = {
  locode: string;
  port_area_code: string;
  berth_code: string;
};

export interface BerthingRowData extends AppTypes.Berthing {
  created: Date;
  arrival: AppTypes.PortEvent | null;
  departure: AppTypes.PortEvent | null;
}
