import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { fetchPortTrafficData } from '@/lib/fetchPortTrafficData';
import { Group, Stack, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { DockingProvider } from '@/app/context/DockingContext';
import { LocationProvider } from '@/app/context/LocationContext';
import { NewDockingContent } from './NewDockingContent';
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
          <DockingProvider initialState={data.dockingState}>
            <Group justify="space-between">
              <Title size="h2">{t('title')}</Title>
              <NewDockingContent />
            </Group>
            {children}
          </DockingProvider>
        </VesselProvider>
      </LocationProvider>
    </Stack>
  ) : (
    <DataUnavailableAlert />
  );
}
