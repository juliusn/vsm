import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { fetchPortTrafficData } from '@/lib/fetchPortTrafficData';
import { Stack } from '@mantine/core';
import { DockingProvider } from '@/app/context/DockingContext';
import { NewOrderContent } from './NewOrderContent';
import { LocationProvider } from '@/app/context/LocationContext';
import { VesselProvider } from '@/app/context/VesselContext';

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await fetchPortTrafficData();

  return data ? (
    <LocationProvider
      initialState={{
        locations: data.locationState.locations,
        portAreas: data.locationState.portAreas,
        berths: data.locationState.berths,
      }}>
      <VesselProvider vessels={data.vessels}>
        <DockingProvider
          initialState={{
            dockings: data.dockingState.dockings,
            dockingEvents: data.dockingState.dockingEvents,
          }}>
          <Stack>
            <NewOrderContent />
            {children}
          </Stack>
        </DockingProvider>
      </VesselProvider>
    </LocationProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
