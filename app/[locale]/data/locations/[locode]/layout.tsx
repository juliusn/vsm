import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { createClient } from '@/lib/supabase/server';
import { SimpleGrid } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { LocationProvider } from './LocationContext';
import { LocodeSwitch } from './LocodeSwitch';

export default async function LocodeLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locode: string }>;
}) {
  const params = await props.params;

  const { locode } = params;

  const { children } = props;

  const t = await getTranslations('LocodeLayout');
  const supabase = await createClient();
  const [
    locationsResponse,
    portAreasResponse,
    berthsResponse,
    berthServicesResponse,
  ] = await Promise.all([
    supabase.from('locations').select('*').eq('locode', locode).single(),
    supabase
      .from('port_areas')
      .select('*')
      .order('port_area_code')
      .eq('locode', locode),
    supabase
      .from('berths')
      .select('*')
      .order('berth_code')
      .eq('locode', locode),
    supabase.from('berth_services').select('*').eq('locode', locode),
  ]);
  const location = locationsResponse.data;
  const portAreas = portAreasResponse.data;
  const berths = berthsResponse.data;
  const berthServices = berthServicesResponse.data;

  return location && portAreas && berths && berthServices ? (
    <LocationProvider
      initialState={{
        location,
        portAreas,
        berths,
        berthServices: berthServices.map((berthService) => ({
          ...berthService,
          titles: berthService.titles as AppTypes.ServiceTitles,
        })),
      }}>
      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        <div>{`${t('title')}: ${locode}`}</div>
        <div>
          <LocodeSwitch locode={locode} />
        </div>
      </SimpleGrid>
      {children}
    </LocationProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
