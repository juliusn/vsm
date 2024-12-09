'use client';

import { useErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { Switch } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { ActionTypes, useLocation } from './LocationContext';

export function LocodeSwitch({ locode }: { locode: string }) {
  const supabase = createClient();
  const { state, dispatch } = useLocation();
  const t = useTranslations('EnabledSwitch');
  const getErrorNotification = useErrorNotification();

  return (
    <Switch
      label={t('label')}
      checked={state.location.enabled}
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
          payload: { enabled: data.enabled },
        });
      }}
    />
  );
}
