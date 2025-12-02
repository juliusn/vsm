import { CommonService, Counterparty, Order } from './query-types';
import { WithDictionary } from './translation';

export type OrderData = Omit<
  Order,
  'common_services' | 'sender' | 'receiver'
> & {
  common_services: WithDictionary<CommonService>[];
  sender: WithDictionary<Counterparty>;
  receiver: WithDictionary<Counterparty>;
};

export type OrderFormValues = {
  sender_counterparty_business_id: string;
  receiver_counterparty_business_id: string;
  berthing: string;
  services: string[];
};

export type OrderRowData = OrderData & {
  created: string;
  arrival: string;
  departure: string;
};
