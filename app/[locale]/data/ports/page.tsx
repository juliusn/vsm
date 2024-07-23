import { PortsApiResponse } from '@/lib/types/ports-api.types';
import { Alert, Stack, Title } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';
import { BerthsTable } from './BerthsTable';
import { PortsTable } from './PortsTable';

export default async function PortsPage() {
  const t = await getTranslations('Data');
  const response = await fetch(
    'https://meri.digitraffic.fi/api/port-call/v1/ports/FIHEL'
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
  const data: PortsApiResponse = await response.json();

  return (
    <Stack>
      <Title size="h4" mt="md">
        {t('ports')}
      </Title>
      <PortsTable portAreas={data.portAreas.features} />
      <Title size="h4" mt="md">
        {t('berths')}
      </Title>
      <BerthsTable berths={data.berths.berths} />
    </Stack>
  );
}
