import { Alert, Center } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function DataUnavailableAlert() {
  const t = useTranslations('DataUnavailableAlert');

  return (
    <Center>
      <Alert
        variant="outline"
        color="red"
        title={t('title')}
        icon={<IconExclamationCircle stroke={1.5} />}>
        {t('message')}
      </Alert>
    </Center>
  );
}
