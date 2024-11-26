import { createClient } from '@/lib/supabase/server';
import { Alert, Group, Title } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
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
      <Group>
        <Title size="h2">{location.locode}</Title>
        <LocodeSwitch locode={locode} />
      </Group>
      {children}
    </LocationProvider>
  ) : (
    <Alert
      variant="outline"
      color="red"
      title={t('alertTitle')}
      icon={<IconExclamationCircle stroke={1.5} />}>
      {t('alertMessage')}
    </Alert>
  );
}
