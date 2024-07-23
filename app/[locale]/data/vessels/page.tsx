import { VesselsApiResponse } from '@/lib/types/vessels-api.types';
import { Alert, Stack, Title } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';
import VesselsList from './VesselsList';

export default async function VesselsPage() {
  const t = await getTranslations('Data');
  const response = await fetch(
    'https://meri.digitraffic.fi/api/ais/v1/vessels'
  );
  if (!response.ok) {
    const { status, statusText } = response;
    return (
      <Alert
        variant="outline"
        color="red"
        title={t('dataAlertTitle')}
        icon={<IconExclamationCircle stroke={1.5} />}>
        {t('dataAlertMessage', { status, statusText })}
      </Alert>
    );
  }
  const data: VesselsApiResponse = await response.json();
  return (
    <Stack>
      <Title size="h4" mt="md">
        {t('vessels')}
      </Title>
      <VesselsList vessels={data} />
    </Stack>
  );
}
