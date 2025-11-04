import { Tables } from './database.types';
import { Berthing } from './query-types';

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
  arrival: Omit<Tables<'port_events'>, 'berthing'> | null;
  departure: Omit<Tables<'port_events'>, 'berthing'> | null;
}
