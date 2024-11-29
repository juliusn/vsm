import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { createClient } from '@/lib/supabase/server';
import { Group, Stack, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { NewOrderContent } from './NewOrderContent';

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('OrdersLayout');
  const supabase = createClient();

  const [locationsResponse, portAreasResponse, berthsResponse] =
    await Promise.all([
      supabase
        .from('locations')
        .select()
        .eq('enabled', true)
        .order('location_name'),
      supabase
        .from('port_areas')
        .select()
        .eq('enabled', true)
        .order('port_area_name'),
      supabase.from('berths').select().eq('enabled', true).order('berth_name'),
    ]);

  if (
    locationsResponse.error ||
    portAreasResponse.error ||
    berthsResponse.error
  ) {
    return <DataUnavailableAlert />;
  }

  const locations = locationsResponse.data;
  const locodes = locations.map((location) => location.locode);
  const portAreas = portAreasResponse.data.filter((portArea) =>
    locodes.includes(portArea.locode)
  );
  const portAreaCodes = portAreas.map((portArea) => portArea.port_area_code);
  const berths = berthsResponse.data.filter((berth) =>
    portAreaCodes.includes(berth.port_area_code)
  );

  return (
    <Stack>
      <Group justify="space-between">
        <Title size="h4">{t('title')}</Title>
        <NewOrderContent
          locations={locations}
          portAreas={portAreas}
          berths={berths}
        />
      </Group>
      {children}
    </Stack>
  );
}
