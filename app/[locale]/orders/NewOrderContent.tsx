'use client';

import { createClient } from '@/lib/supabase/client';
import { Button, Group, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { NewOrderForm } from './NewOrderForm';

export function NewOrderContent() {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('NewOrderContent');
  const supabase = createClient();
  const [locations, setLocations] = useState<AppTypes.Location[] | null>(null);
  const [portAreas, setPortAreas] = useState<AppTypes.PortArea[] | null>(null);
  const [berths, setBerths] = useState<AppTypes.Berth[] | null>(null);
  const [services, setServices] = useState<AppTypes.CommonService[] | null>(
    null
  );
  const dataAvailable =
    locations !== null &&
    portAreas !== null &&
    berths !== null &&
    services !== null;

  useEffect(() => {
    const query = async () => {
      const [
        locationsResponse,
        portAreasResponse,
        berthsResponse,
        servicesResponse,
      ] = await Promise.all([
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

      if (
        !locationsResponse.error &&
        !portAreasResponse.error &&
        !berthsResponse.error &&
        !servicesResponse.error
      ) {
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
        const services = servicesResponse.data.map((row) => ({
          ...row,
          titles: row.titles as AppTypes.ServiceTitles,
        }));
        setLocations(locations);
        setPortAreas(filteredPortAreas);
        setBerths(filteredBerths);
        setServices(services);
      }
    };

    query();
  }, [supabase]);

  return (
    <>
      <Group justify="space-between">
        <Title size="h4">{t('title')}</Title>
        <Button
          onClick={open}
          disabled={!dataAvailable}
          leftSection={<IconPlus size={20} stroke={2} />}>
          {t('buttonLabel')}
        </Button>
      </Group>
      {dataAvailable && (
        <Modal opened={opened} onClose={close} title={t('modalTitle')}>
          <NewOrderForm
            locations={locations}
            portAreas={portAreas}
            berths={berths}
            services={services}
            close={close}
          />
        </Modal>
      )}
    </>
  );
}
