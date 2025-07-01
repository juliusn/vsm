export type OrderFormValues = {
  berthing: string;
  services: string[];
};

export type OrderRowData = AppTypes.OrderData & {
  created: string;
  arrival: string;
  departure: string;
};
