export type PortEvent = {
  formKey: string;
  id: string | null;
  date: string | null;
  time: string | null;
  locode: string | null;
  portAreaCode: string | null;
  berthCode: string | null;
  position: string | null;
};

export type PortEventWithDate = Omit<PortEvent, 'date'> & { date: string };

export type BerthingFormValues = {
  imo: number | null;
  vesselName: string | null;
  arrival: PortEvent | null;
  shiftings: PortEvent[];
  departure: PortEvent | null;
};

export type BerthingSubmitValues = {
  imo: number | null;
  vesselName: string | null;
  arrival: PortEventWithDate | null;
  shiftings: PortEventWithDate[];
  departure: PortEventWithDate | null;
};

export type PortAreaIdentifier = {
  locode: string;
  port_area_code: string;
};

export type BerthIdentifier = {
  locode: string;
  port_area_code: string;
  berth_code: string;
};
