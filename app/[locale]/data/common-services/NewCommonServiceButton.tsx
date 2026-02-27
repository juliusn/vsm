'use client';

import { useCommonServices } from '@/app/context/CommonServiceContext';
import {
  usePostgresErrorNotification,
  useServiceSavedNotification,
} from '@/app/hooks/notifications';
import { commonServicesSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { TranslationWithAbbreviation } from '@/lib/types/translation';
import { Button } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEditServiceModal } from '../../../context/EditServiceModalContext';

export function NewCommonServiceButton() {
  const { openEditModal, closeEditModal } = useEditServiceModal();
  const t = useTranslations('NewCommonServiceButton');
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getServiceSavedNotification = useServiceSavedNotification();
  const { dispatch } = useCommonServices();

  const onSave = async (
    translationEn: TranslationWithAbbreviation,
    translationFi: TranslationWithAbbreviation
  ) => {
    const newServiceResponse = await supabase
      .from('common_services')
      .insert({})
      .select()
      .single();

    if (newServiceResponse.error) {
      showNotification(getErrorNotification(newServiceResponse.status));
      return;
    }

    const queryEn = supabase.from('common_service_translations').insert({
      common_service: newServiceResponse.data.id,
      locale: 'en',
      title: translationEn.title,
      abbreviation: translationEn.abbreviation,
    });

    const queryFi = supabase.from('common_service_translations').insert({
      common_service: newServiceResponse.data.id,
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
      .from('common_services')
      .select(commonServicesSelector)
      .eq('id', newServiceResponse.data.id)
      .single();

    if (error) {
      showNotification(getErrorNotification(status));
      return;
    }

    if (data.sort_order === null) {
      showNotification(getErrorNotification(500));
      return;
    }

    dispatch({
      type: 'added',
      item: {
        ...data,
        sort_order: data.sort_order,
        dictionary: { en: translationEn, fi: translationFi },
      },
    });

    showNotification(getServiceSavedNotification());
    closeEditModal();
  };

  const handleClick = () =>
    openEditModal({
      title: t('modalTitle'),
      translationEn: { locale: 'en', title: '', abbreviation: '' },
      translationFi: { locale: 'fi', title: '', abbreviation: '' },
      onSave,
    });

  return (
    <Button
      onClick={handleClick}
      leftSection={<IconPlus size={20} stroke={2} />}>
      {t('buttonLabel')}
    </Button>
  );
}
