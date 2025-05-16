import { PostgrestBuilder } from '@supabase/postgrest-js';

export type Mutation<T> = {
  query: PostgrestBuilder<T>;
  stateUpdateHandler: (data: T) => void;
};
