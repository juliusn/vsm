import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { fetchPortTrafficData } from '@/lib/fetchPortTrafficData';
import { Stack } from '@mantine/core';
import { DockingProvider } from '../../context/DockingContext';
import { NewOrderContent } from './NewOrderContent';
import { LocationProvider } from '../../context/LocationContext';

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await fetchPortTrafficData();

  return data ? (
    <LocationProvider
      vessels={data.vessels}
      locations={data.locations}
      portAreas={data.portAreas}
      berths={data.berths}>
      <DockingProvider
        dockings={data.dockings}
        dockingEvents={data.dockingEvents}>
        <Stack>
          <NewOrderContent />
          {children}
        </Stack>
      </DockingProvider>
    </LocationProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
