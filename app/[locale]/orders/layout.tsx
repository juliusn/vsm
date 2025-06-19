import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { BerthingProvider } from '@/app/context/BerthingContext';
import { LocationProvider } from '@/app/context/LocationContext';
import { VesselProvider } from '@/app/context/VesselContext';
import { fetchOrdersData } from '@/lib/fetchOrdersData';
import { Stack } from '@mantine/core';
import { NewOrderContent } from './NewOrderContent';
import { BerthServiceProvider } from '@/app/context/BerthServiceContext';
import { CommonServiceProvider } from '@/app/context/CommonServiceContext';
import { OrderDataProvider } from '@/app/context/OrderContext';

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
        <BerthingProvider initialBerthings={data.berthings}>
          <BerthServiceProvider initialValues={data.berthServices}>
            <CommonServiceProvider initialValues={data.commonServices}>
              <OrderDataProvider initialOrderData={data.orderData}>
                <Stack>
                  <NewOrderContent />
                  {children}
                </Stack>
              </OrderDataProvider>
            </CommonServiceProvider>
          </BerthServiceProvider>
        </BerthingProvider>
      </VesselProvider>
    </LocationProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
