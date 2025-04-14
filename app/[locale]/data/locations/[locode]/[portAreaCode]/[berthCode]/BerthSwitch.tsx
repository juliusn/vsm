'use client';

import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { Switch } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { ActionTypes, useLocation } from '../../LocationContext';

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
  const { state, dispatch } = useLocation();
  const berth = state.berths.find(
    (berth) =>
      berth.locode === locode &&
      berth.port_area_code === portAreaCode &&
      berth.berth_code === berthCode
  );
  const t = useTranslations('EnabledSwitch');
  const getErrorNotification = usePostgresErrorNotification();

  return (
    <Switch
      label={t('label')}
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
