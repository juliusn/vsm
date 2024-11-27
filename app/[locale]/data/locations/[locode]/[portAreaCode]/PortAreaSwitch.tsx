'use client';

import { useErrorNotification } from '@/app/hooks/useErrorNotification';
import { createClient } from '@/lib/supabase/client';
import { Switch } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { ActionTypes, useLocation } from '../LocationContext';

export function PortAreaSwitch({
  locode,
  portAreaCode,
}: {
  locode: string;
  portAreaCode: string;
}) {
  const supabase = createClient();
  const { state, dispatch } = useLocation();
  const portArea = state.portAreas.find(
    (portArea) =>
      portArea.locode === locode && portArea.port_area_code === portAreaCode
  );
  const t = useTranslations('EnabledSwitch');
  const getErrorNotification = useErrorNotification();

  return (
    <Switch
      label={t('label')}
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
