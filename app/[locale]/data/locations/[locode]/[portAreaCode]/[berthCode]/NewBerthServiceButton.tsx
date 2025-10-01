'use client';

import { useBerthServices } from '@/app/context/BerthServiceContext';
import { useEditServiceModal } from '@/app/context/EditServiceModalContext';
import {
  usePostgresErrorNotification,
  useServiceSavedNotification,
} from '@/app/hooks/notifications';
import { berthServicesSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { TranslationWithAbbreviation } from '@/lib/types/translation';
import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

type Params = { locode: string; portAreaCode: string; berthCode: string };

export function NewBerthServiceButton() {
  const { openEditModal, closeEditModal } = useEditServiceModal();
  const t = useTranslations('NewBerthServiceButton');
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getServiceSavedNotification = useServiceSavedNotification();
  const { dispatch } = useBerthServices();
  const { locode, portAreaCode, berthCode }: Params = useParams();

  const onSave = async (
    translationEn: TranslationWithAbbreviation,
    translationFi: TranslationWithAbbreviation
  ) => {
    const newServiceResponse = await supabase
      .from('berth_services')
      .insert({
        locode,
        port_area_code: portAreaCode,
        berth_code: berthCode,
        enabled: true,
      })
      .select()
      .single();

    if (newServiceResponse.error) {
      showNotification(getErrorNotification(newServiceResponse.status));
      return;
    }

    const queryEn = supabase.from('berth_service_translations').insert({
      berth_service: newServiceResponse.data.id,
      locale: 'en',
      title: translationEn.title,
      abbreviation: translationEn.abbreviation,
    });

    const queryFi = supabase.from('berth_service_translations').insert({
      berth_service: newServiceResponse.data.id,
      locale: 'fi',
      title: translationFi.title,
      abbreviation: translationFi.abbreviation,
    });

    const translationResponses = await Promise.all([queryEn, queryFi]);

    for (const response of translationResponses) {
      if (response.error) {
        showNotification(getErrorNotification(response.status));
        return;
      }
    }

    const { data, error, status } = await supabase
      .from('berth_services')
      .select(berthServicesSelector)
      .eq('id', newServiceResponse.data.id)
      .single();

    if (error) {
      showNotification(getErrorNotification(status));
      return;
    }

    dispatch({
      type: 'added',
      item: {
        ...data,
        dictionary: { en: translationEn, fi: translationFi },
      },
    });

    showNotification(getServiceSavedNotification());
    closeEditModal();
  };

  const handleClick = () => {
    openEditModal({
      title: t('modalTitle'),
      translationEn: { locale: 'en', title: '', abbreviation: '' },
      translationFi: { locale: 'fi', title: '', abbreviation: '' },
      onSave,
    });
  };

  return (
    <Button
      onClick={handleClick}
      leftSection={<IconPlus size={20} stroke={2} />}>
      {t('buttonLabel')}
    </Button>
  );
}
