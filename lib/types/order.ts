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
