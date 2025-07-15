import { Order } from './QueryTypes';

export type OrderFormValues = {
  sender: string;
  receiver: string;
  berthing: string;
  services: string[];
};

export type OrderRowData = Order & {
  created: string;
  arrival: string;
  departure: string;
};
