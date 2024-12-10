'use client';

import {
  useErrorNotification,
  useServiceSavedNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { ActionTypes, useCommonServices } from './CommonServicesContext';
import { useEditServiceModal } from '../EditServicesModalContext';

export function NewCommonServiceButton() {
  const { openEditModal, closeEditModal } = useEditServiceModal();
  const t = useTranslations('NewCommonServiceButton');
  const supabase = createClient();
  const getErrorNotification = useErrorNotification();
  const getServiceSavedNotification = useServiceSavedNotification();
  const { dispatch } = useCommonServices();

  return (
    <Button
      onClick={() => {
        openEditModal({
          title: t('modalTitle'),
          serviceTitles: { en: '', fi: '' },
          onSave: async (titles) => {
            const { data, error, status } = await supabase
              .from('common_services')
              .insert({ titles })
              .select()
              .single();

            if (error) {
              showNotification(getErrorNotification(status));
              return;
            }

            dispatch({
              type: ActionTypes.INSERT_SERVICE,
              payload: { service: data as AppTypes.CommonService },
            });

            showNotification(getServiceSavedNotification());
            closeEditModal();
          },
        });
      }}
      leftSection={<IconPlus size={20} stroke={2} />}>
      {t('buttonLabel')}
    </Button>
  );
}
