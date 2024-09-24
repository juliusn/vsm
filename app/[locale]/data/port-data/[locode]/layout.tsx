import { PortAreaFeature, PortsApiResponse } from '@/lib/types/ports-api.types';
import { PortAreaApiProvider } from './PortAreaApiContext';
import { createClient } from '@/lib/supabase/server';
import { PortAreaDbProvider } from './PortAreaDbContext';
import { getTranslations } from 'next-intl/server';
import { Alert } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';

export default async function LocodeLayout({
  children,
  params: { locode },
}: {
  children: React.ReactNode;
  params: { locode: string };
}) {
  const t = await getTranslations('LocodeLayout');
  const supabase = createClient();
  const apiResponse = await fetch(
    `https://meri.digitraffic.fi/api/port-call/v1/ports/${locode}`
  );
  let existingPortAreas: PortAreaFeature[] = [];
  if (apiResponse.ok) {
    const data: PortsApiResponse = await apiResponse.json();
    existingPortAreas = data.portAreas.features;
  }
  let selectedPortAreas: string[] = [];
  const dbResponse = await supabase.from('port-area-codes').select('*');
  if (!dbResponse.error) {
    selectedPortAreas = dbResponse.data.map((row) => row['port-area-code']);
  }
  return (
    <PortAreaApiProvider value={existingPortAreas}>
      <PortAreaDbProvider value={selectedPortAreas}>
        {(!apiResponse.ok || dbResponse.error) && (
          <Alert
            variant="outline"
            color="yellow"
            icon={<IconAlertTriangle stroke={1.5} />}
            title={t('alertTitle')}>
            {t('alertMessage')}
          </Alert>
        )}
        {children}
      </PortAreaDbProvider>
    </PortAreaApiProvider>
  );
}
