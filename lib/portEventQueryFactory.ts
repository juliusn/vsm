import { SupabaseClient } from '@supabase/supabase-js';
import { PostgrestBuilder } from '@supabase/postgrest-js';
import dayjs from 'dayjs';

interface Params {
  berthing: string;
  portEvent: Omit<AppTypes.PortEvent, 'berthing'> | null | undefined;
  type: AppTypes.PortEvent['type'];
  newValues: {
    date: Date | '';
    time: string;
  };
}

type QueryFactory = (client: SupabaseClient) => PostgrestBuilder<null>;

export function portEventQueryFactory({
  berthing,
  portEvent,
  type,
  newValues: { date, time },
}: Params): QueryFactory | undefined {
  if (portEvent) {
    if (date) {
      if (
        !dayjs(date).isSame(portEvent.estimated_date, 'day') ||
        time !== (portEvent.estimated_time?.slice(0, 5) || '')
      ) {
        return (client: SupabaseClient) =>
          client
            .from('port_events')
            .update({
              estimated_date: dayjs(date).format('YYYY-MM-DD'),
              estimated_time: time || null,
            })
            .eq('id', portEvent.id);
      }
    } else {
      return (supabase: SupabaseClient) =>
        supabase.from('port_events').delete().eq('id', portEvent.id);
    }
  } else {
    if (date) {
      return (supabase: SupabaseClient) =>
        supabase.from('port_events').insert({
          berthing,
          type,
          estimated_date: dayjs(date).format('YYYY-MM-DD'),
          estimated_time: time || null,
        });
    }
  }
}
