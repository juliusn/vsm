import type { Database as DB } from '@/lib/database.types';

declare global {
  type Database = DB;
  type Todo = DB['public']['Tables']['todos']['Row'];
}

// Use type safe message keys with `next-intl`
type Messages = typeof import('./messages/en.json');
declare interface IntlMessages extends Messages {}
