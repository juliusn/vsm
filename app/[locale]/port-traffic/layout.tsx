import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { fetchPortTrafficData } from '@/lib/fetchPortTrafficData';
import { Group, Stack, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { DockingProvider } from '../../context/DockingContext';
import { LocationProvider } from '../../context/LocationContext';
import { NewDockingContent } from './NewDockingContent';

export default async function PortTrafficLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('PortTrafficLayout');
  const data = await fetchPortTrafficData();

  return data ? (
    <Stack>
      <LocationProvider
        vessels={data.vessels}
        locations={data.locations}
        portAreas={data.portAreas}
        berths={data.berths}>
        <DockingProvider
          dockings={data.dockings}
          dockingEvents={data.dockingEvents}>
          <Group justify="space-between">
            <Title size="h2">{t('title')}</Title>
            <NewDockingContent />
          </Group>
          {children}
        </DockingProvider>
      </LocationProvider>
    </Stack>
  ) : (
    <DataUnavailableAlert />
  );
}
