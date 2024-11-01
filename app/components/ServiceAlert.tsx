'use client';

import { Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function ServiceAlert() {
  const t = useTranslations('ServiceAlert');
  return (
    <Alert
      variant="outline"
      color="yellow"
      icon={<IconAlertTriangle stroke={1.5} />}
      title={t('alertTitle')}>
      {t('alertMessage')}
    </Alert>
  );
}
