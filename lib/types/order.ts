import { SortableCommonService } from '@/app/context/CommonServiceContext';
import { Counterparty, Order } from './query-types';
import { WithDictionary } from './translation';

export type OrderData = Omit<
  Order,
  'common_services' | 'sender' | 'receiver'
> & {
  common_services: WithDictionary<SortableCommonService>[];
  sender: WithDictionary<Counterparty>;
  receiver: WithDictionary<Counterparty>;
};
