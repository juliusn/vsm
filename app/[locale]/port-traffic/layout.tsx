import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { createClient } from '@/lib/supabase/server';
import { Group, Stack, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { NewDockingContent } from './NewDockingContent';

export default async function PortTrafficLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('PortTrafficLayout');
  const supabase = createClient();

  const fetchData = async () => {
    const vesselsResponse = await fetch(
      'https://meri.digitraffic.fi/api/ais/v1/vessels'
    );
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
        supabase
          .from('berths')
          .select()
          .eq('enabled', true)
          .order('berth_name'),
        supabase.from('common_services').select(),
      ]);

    const success =
      vesselsResponse.ok &&
      !locationsResponse.error &&
      !portAreasResponse.error &&
      !berthsResponse.error;

    if (success) {
      const vesselsData = (await vesselsResponse.json()) as AppTypes.Vessel[];
      const vessels = vesselsData
        .filter((vessel) => vessel.imo !== 0)
        .filter(
          (vessel, index, array) =>
            array.findIndex((v) => v.imo === vessel.imo) === index
        )
        .sort((a, b) => a.timestamp - b.timestamp);
      const locations = locationsResponse.data;
      const locodes = locations.map((location) => location.locode);
      const filteredPortAreas = portAreasResponse.data.filter((portArea) =>
        locodes.includes(portArea.locode)
      );
      const filteredPortAreaCodes = filteredPortAreas.map(
        (portArea) => portArea.port_area_code
      );
      const filteredBerths = berthsResponse.data.filter((berth) =>
        filteredPortAreaCodes.includes(berth.port_area_code)
      );
      return {
        vessels,
        locations,
        portAreas: filteredPortAreas,
        berths: filteredBerths,
      };
    }

    return null;
  };

  const data = await fetchData();

  return data ? (
    <Stack>
      <Group justify="space-between">
        <Title size="h2">{t('title')}</Title>
        <NewDockingContent
          vessels={data.vessels}
          locations={data.locations}
          portAreas={data.portAreas}
          berths={data.berths}
        />
      </Group>
      {children}
    </Stack>
  ) : (
    <DataUnavailableAlert />
  );
}
