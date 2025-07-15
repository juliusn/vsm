import { Berthing } from './QueryTypes';

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

export interface BerthingRowData extends Omit<Berthing, 'port_events'> {
  created: Date;
  arrival: Omit<AppTypes.PortEvent, 'berthing'> | null;
  departure: Omit<AppTypes.PortEvent, 'berthing'> | null;
}
