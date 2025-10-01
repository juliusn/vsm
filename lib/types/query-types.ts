import { QueryData, SupabaseClient } from '@supabase/supabase-js';
import {
  berthingsSelector,
  berthServicesSelector,
  commonServicesSelector,
  counterpartiesSelector,
  ordersSelector,
} from '../querySelectors';

declare const supabase: SupabaseClient<Database>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _berthingsQuery = supabase
  .from('berthings')
  .select(berthingsSelector)
  .single();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _counterpartiesQuery = supabase
  .from('counterparties')
  .select(counterpartiesSelector)
  .single();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _ordersQuery = supabase.from('orders').select(ordersSelector).single();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _commonServicesQuery = supabase
  .from('common_services')
  .select(commonServicesSelector)
  .single();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _berthServicesQuery = supabase
  .from('berth_services')
  .select(berthServicesSelector)
  .single();

export type Berthing = QueryData<typeof _berthingsQuery>;
export type Counterparty = QueryData<typeof _counterpartiesQuery>;
export type Order = QueryData<typeof _ordersQuery>;
export type CommonService = QueryData<typeof _commonServicesQuery>;
export type BerthService = QueryData<typeof _berthServicesQuery>;
