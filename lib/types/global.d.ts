import type { Database as DB } from '@/lib/types/database.types';

declare global {
  type Database = DB;
  namespace AppTypes {
    type Profile = Database['public']['Tables']['profiles']['Row'];
    type Location = Database['public']['Tables']['locations']['Row'];
    type PortArea = Database['public']['Tables']['port_areas']['Row'];
    type Berth = Database['public']['Tables']['berths']['Row'];
  }
}

type IntlMessages = typeof import('../../messages/en.json');
