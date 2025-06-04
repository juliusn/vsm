'use client';

import { EnabledSwitch } from '@/app/components/EnabledSwitch';
import { ActionTypes, useLocations } from '@/app/context/LocationContext';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { showNotification } from '@mantine/notifications';

export function PortAreaSwitch({
  locode,
  portAreaCode,
}: {
  locode: string;
  portAreaCode: string;
}) {
  const supabase = createClient();
  const { state, dispatch } = useLocations();
  const portArea = state.portAreas.find(
    (portArea) =>
      portArea.locode === locode && portArea.port_area_code === portAreaCode
  );
  const getErrorNotification = usePostgresErrorNotification();

  return (
    <EnabledSwitch
      checked={portArea?.enabled}
      onChange={async (event) => {
        const newChecked = event.currentTarget.checked;
        const { data, error, status } = await supabase
          .from('port_areas')
          .update({ enabled: newChecked })
          .eq('locode', locode)
          .eq('port_area_code', portAreaCode)
          .select()
          .single();

        if (error) {
          showNotification(getErrorNotification(status));
          return;
        }

        dispatch({
          type: ActionTypes.UPDATE_PORT_AREA_ENABLED,
          payload: { locode, portAreaCode, enabled: data.enabled },
        });
      }}
    />
  );
}
