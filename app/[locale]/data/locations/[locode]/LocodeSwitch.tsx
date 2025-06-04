'use client';

import { EnabledSwitch } from '@/app/components/EnabledSwitch';
import { ActionTypes, useLocations } from '@/app/context/LocationContext';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { showNotification } from '@mantine/notifications';

export function LocodeSwitch({ locode }: { locode: string }) {
  const supabase = createClient();
  const { state, dispatch } = useLocations();
  const location = state.locations.find(
    (location) => location.locode === locode
  );
  const getErrorNotification = usePostgresErrorNotification();

  return (
    <EnabledSwitch
      checked={location?.enabled}
      onChange={async (event) => {
        const newChecked = event.currentTarget.checked;
        const { data, error, status } = await supabase
          .from('locations')
          .update({ enabled: newChecked })
          .eq('locode', locode)
          .select()
          .single();

        if (error) {
          showNotification(getErrorNotification(status));
          return;
        }

        dispatch({
          type: ActionTypes.UPDATE_LOCATION_ENABLED,
          payload: { locode, enabled: data.enabled },
        });
      }}
    />
  );
}
