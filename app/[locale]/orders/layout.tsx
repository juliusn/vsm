import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { DockingProvider } from '@/app/context/DockingContext';
import { LocationProvider } from '@/app/context/LocationContext';
import { VesselProvider } from '@/app/context/VesselContext';
import { fetchOrdersData } from '@/lib/fetchOrdersData';
import { Stack } from '@mantine/core';
import { NewOrderContent } from './NewOrderContent';
import { BerthServiceProvider } from '@/app/context/BerthServiceContext';
import { CommonServiceProvider } from '@/app/context/CommonServiceContext';

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await fetchOrdersData();

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
          <BerthServiceProvider initialValues={data.berthServices}>
            <CommonServiceProvider initialValues={data.commonServices}>
              <Stack>
                <NewOrderContent />
                {children}
              </Stack>
            </CommonServiceProvider>
          </BerthServiceProvider>
        </DockingProvider>
      </VesselProvider>
    </LocationProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
