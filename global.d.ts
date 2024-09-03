import type { Database as DB } from '@/lib/types/database.types';

declare global {
  type Database = DB;
  type Profile = Database['public']['Tables']['profiles']['Row'];
}

type IntlMessages = typeof import('./messages/en.json');
