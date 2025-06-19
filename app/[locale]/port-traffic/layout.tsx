import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { fetchPortTrafficData } from '@/lib/fetchPortTrafficData';
import { Group, Stack, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { BerthingProvider } from '@/app/context/BerthingContext';
import { LocationProvider } from '@/app/context/LocationContext';
import { NewBerthingContent } from './NewBerthingContent';
import { VesselProvider } from '@/app/context/VesselContext';

export default async function PortTrafficLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('PortTrafficLayout');
  const data = await fetchPortTrafficData();

  return data ? (
    <Stack>
      <LocationProvider initialState={data.locationState}>
        <VesselProvider vessels={data.vessels}>
          <BerthingProvider initialBerthings={data.berthings}>
            <Group justify="space-between">
              <Title size="h2">{t('title')}</Title>
              <NewBerthingContent />
            </Group>
            {children}
          </BerthingProvider>
        </VesselProvider>
      </LocationProvider>
    </Stack>
  ) : (
    <DataUnavailableAlert />
  );
}
