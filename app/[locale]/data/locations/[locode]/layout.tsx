import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { createClient } from '@/lib/supabase/server';
import { SimpleGrid } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { LocationProvider } from './LocationContext';
import { LocodeSwitch } from './LocodeSwitch';

export default async function LocodeLayout({
  children,
  params: { locode },
}: {
  children: React.ReactNode;
  params: { locode: string };
}) {
  const t = await getTranslations('LocodeLayout');
  const supabase = createClient();
  const [locationsResponse, portAreasResponse, berthsResponse] =
    await Promise.all([
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
    ]);
  const location = locationsResponse.data;
  const portAreas = portAreasResponse.data;
  const berths = berthsResponse.data;

  return location && portAreas && berths ? (
    <LocationProvider initialState={{ location, portAreas, berths }}>
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
