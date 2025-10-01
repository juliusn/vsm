import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { BerthingProvider } from '@/app/context/BerthingContext';
import { BerthServiceProvider } from '@/app/context/BerthServiceContext';
import { CommonServiceProvider } from '@/app/context/CommonServiceContext';
import { CounterpartyProvider } from '@/app/context/CounterpartyContext';
import { LocationProvider } from '@/app/context/LocationContext';
import { OrderProvider } from '@/app/context/OrderContext';
import { VesselProvider } from '@/app/context/VesselContext';
import { fetchOrdersData } from '@/lib/fetchOrdersData';
import { normalizeOrders, normalizeTranslations } from '@/lib/normalizers';
import {
  BerthService,
  CommonService,
  Counterparty,
} from '@/lib/types/query-types';
import { Stack } from '@mantine/core';
import { NewOrderContent } from './NewOrderContent';

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
          <BerthServiceProvider
            initialValues={normalizeTranslations<BerthService>(
              data.berthServices
            )}>
            <CommonServiceProvider
              initialValues={normalizeTranslations<CommonService>(
                data.commonServices
              )}>
              <OrderProvider initialOrders={normalizeOrders(data.orders)}>
                <CounterpartyProvider
                  counterparties={normalizeTranslations<Counterparty>(
                    data.counterparties
                  )}>
                  <Stack>
                    <NewOrderContent />
                    {children}
                  </Stack>
                </CounterpartyProvider>
              </OrderProvider>
            </CommonServiceProvider>
          </BerthServiceProvider>
        </BerthingProvider>
      </VesselProvider>
    </LocationProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
