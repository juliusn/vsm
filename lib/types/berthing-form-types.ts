export type PortEventFormValues = {
  formKey: string;
  id: string | null;
  date: string | null;
  time: string | null;
  locode: string | null;
  portAreaCode: string | null;
  berthCode: string | null;
  position: string | null;
  default_standby_minutes: number;
  default_duration_minutes: number;
  max_assignees: number;
  is_public: boolean;
};

export type PortEventWithDate = Omit<PortEventFormValues, 'date'> & {
  date: string;
};

export type BerthingFormValues = {
  imo: number | null;
  vesselName: string | null;
  arrival: PortEventFormValues | null;
  shiftings: PortEventFormValues[];
  departure: PortEventFormValues | null;
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
