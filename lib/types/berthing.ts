export interface BerthingFormValues {
  imo: number | null;
  vesselName: string | null;
  arrivalDate: string | null;
  arrivalTime: string | null;
  arrivalLocode: string | null;
  arrivalPortArea: string | null;
  arrivalBerth: string | null;
  arrivalPosition: string | null;
  departureDate: string | null;
  departureTime: string | null;
  departureLocode: string | null;
  departurePortArea: string | null;
  departureBerth: string | null;
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
