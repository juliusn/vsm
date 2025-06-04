'use client';

import { EnabledSwitch } from '@/app/components/EnabledSwitch';
import { ActionTypes, useLocations } from '@/app/context/LocationContext';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { showNotification } from '@mantine/notifications';

export function BerthSwitch({
  locode,
  portAreaCode,
  berthCode,
}: {
  locode: string;
  portAreaCode: string;
  berthCode: string;
}) {
  const supabase = createClient();
  const { state, dispatch } = useLocations();
  const berth = state.berths.find(
    (berth) =>
      berth.locode === locode &&
      berth.port_area_code === portAreaCode &&
      berth.berth_code === berthCode
  );
  const getErrorNotification = usePostgresErrorNotification();

  return (
    <EnabledSwitch
      checked={berth?.enabled}
      onChange={async (event) => {
        const newChecked = event.currentTarget.checked;
        const { data, error, status } = await supabase
          .from('berths')
          .update({ enabled: newChecked })
          .eq('locode', locode)
          .eq('port_area_code', portAreaCode)
          .eq('berth_code', berthCode)
          .select()
          .single();

        if (error) {
          showNotification(getErrorNotification(status));
          return;
        }

        dispatch({
          type: ActionTypes.UPDATE_BERTH_ENABLED,
          payload: { locode, portAreaCode, berthCode, enabled: data.enabled },
        });
      }}
    />
  );
}
