import { QueryData, SupabaseClient } from '@supabase/supabase-js';
import {
  berthingsSelector,
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

export type Berthing = QueryData<typeof _berthingsQuery>;
export type Counterparty = QueryData<typeof _counterpartiesQuery>;
export type Order = QueryData<typeof _ordersQuery>;
