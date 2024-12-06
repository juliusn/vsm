import { routing } from '@/i18n/routing';
import type { Database as DB } from '@/lib/types/database.types';

declare global {
  type Database = DB;
  namespace AppTypes {
    type Profile = Database['public']['Tables']['profiles']['Row'];
    type Location = Database['public']['Tables']['locations']['Row'];
    type PortArea = Database['public']['Tables']['port_areas']['Row'];
    type Berth = Database['public']['Tables']['berths']['Row'];
    type Locale = (typeof routing.locales)[number];
    type ServiceTitles = Record<Locale, string>;
    type CommonService = Omit<
      Database['public']['Tables']['common_services']['Row'],
      'titles'
    > & { titles: ServiceTitles };
    type BerthService = Omit<
      Database['public']['Tables']['berth_services']['Row'],
      'titles'
    > & {
      titles: ServiceTitles;
    };
  }
}

type IntlMessages = typeof import('../../messages/en.json');
