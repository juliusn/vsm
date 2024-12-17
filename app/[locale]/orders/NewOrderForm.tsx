'use client';

import {
  Button,
  ComboboxItem,
  ComboboxItemGroup,
  Group,
  Select,
  Stack,
  useComputedColorScheme,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import 'dayjs/locale/fi';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { VesselDetails } from './VesselDetails';
import { createClient } from '@/lib/supabase/client';
import { useErrorNotification } from '@/app/hooks/notifications';
import { showNotification } from '@mantine/notifications';

type PortAreaIdentifier = {
  locode: string;
  port_area_code: string;
};

type BerthIdentifier = {
  locode: string;
  port_area_code: string;
  berth_code: string;
};

export function NewOrderForm({
  locations,
  portAreas,
  berths,
  services,
  close,
}: {
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
  services: AppTypes.CommonService[];
  close: () => void;
}) {
  const t = useTranslations('NewOrderForm');
  const locale = useLocale() as AppTypes.Locale;
  const getErrorNotification = useErrorNotification();
  const supabase = createClient();
  const colorScheme = useComputedColorScheme();
  const [locode, setLocode] = useState<string | null>(null);
  const locationsData = locations.map(
    ({ locode, location_name }): ComboboxItem => ({
      value: locode,
      label: location_name,
    })
  );
  const [portAreaId, setPortAreaId] = useState<PortAreaIdentifier | null>(null);
  const [berthId, setBerthId] = useState<BerthIdentifier | null>(null);
  const portArea = portAreaId ? JSON.stringify(portAreaId) : null;
  const berth = berthId ? JSON.stringify(berthId) : null;

  const filteredPortAreas = portAreas.filter((portArea) =>
    locode ? portArea.locode === locode : true
  );

  const filteredPortAreaLocationNames = filteredPortAreas.map(
    ({ locode }) =>
      locations.find((location) => location.locode === locode)?.location_name
  );

  const portAreaData = locations.map(
    ({ locode, location_name }): ComboboxItemGroup => ({
      group: location_name,
      items: filteredPortAreas
        .filter((portArea) => portArea.locode === locode)
        .map(
          ({ locode, port_area_code, port_area_name }): ComboboxItem => ({
            value: JSON.stringify({ locode, port_area_code }),
            label: `${port_area_code} - ${port_area_name}`,
          })
        ),
    })
  );

  const filteredBerths = berths.filter(
    (berth) =>
      (locode ? berth.locode === locode : true) &&
      (portAreaId
        ? portAreaId.locode === berth.locode &&
          portAreaId.port_area_code === berth.port_area_code
        : true)
  );

  const berthsData = filteredPortAreas.map(
    ({ port_area_code, port_area_name }, index): ComboboxItemGroup => ({
      group: `${filteredPortAreaLocationNames[index]} ${port_area_name}`,
      items: filteredBerths
        .filter((berth) => berth.port_area_code === port_area_code)
        .map(
          ({
            locode,
            port_area_code,
            berth_code,
            berth_name,
          }): ComboboxItem => ({
            value: JSON.stringify({ locode, port_area_code, berth_code }),
            label:
              berth_code === berth_name
                ? berth_code
                : `${berth_code} - ${berth_name}`,
          })
        ),
    })
  );

  const [vessels, setVessels] = useState<AppTypes.Vessel[]>([]);
  const [selectedVessel, setSelectedVessel] = useState<string | null>(null);
  const vesselItems = vessels.map(
    (vessel): ComboboxItem => ({
      value: JSON.stringify(vessel),
      label: vessel.name,
    })
  );

  const serviceItems = services.map(
    (service): ComboboxItem => ({
      value: JSON.stringify(service.titles),
      label: service.titles[locale],
    })
  );
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);

  const [insertIsPending, startInsert] = useTransition();
  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();
    const vesselMmsi = selectedVessel
      ? (JSON.parse(selectedVessel) as AppTypes.Vessel).mmsi
      : null;

    startInsert(async () => {
      const { error, status } = await supabase.from('orders').insert({
        vessel_mmsi: vesselMmsi,
        service_titles: selectedService,
        time: selectedTime?.toString(),
      });

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      close();
    });
  };

  useEffect(() => {
    const fetchVessels = async () => {
      const vesselsResponse = await fetch(
        'https://meri.digitraffic.fi/api/ais/v1/vessels'
      );
      if (vesselsResponse.ok) {
        setVessels(await vesselsResponse.json());
      }
    };
    fetchVessels();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Select
          data={locationsData}
          value={locode}
          label={t('location')}
          placeholder={t('selectLocation')}
          searchable
          clearable
          onChange={(value) => {
            setLocode(value);
            if (!value) {
              setPortAreaId(null);
              setBerthId(null);
            }
          }}
        />
        <Select
          data={portAreaData}
          value={portArea}
          label={t('portArea')}
          placeholder={t('selectPortArea')}
          searchable
          clearable
          onChange={(value) => {
            if (value) {
              const portArea: PortAreaIdentifier = JSON.parse(value);
              setPortAreaId(portArea);
              setLocode(portArea.locode);
            } else {
              setPortAreaId(null);
              setBerthId(null);
            }
          }}
          styles={(theme) => ({
            groupLabel: {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              boxShadow: theme.shadows.xs,
              backgroundColor:
                colorScheme === 'light' ? theme.white : theme.colors.dark[6],
            },
          })}
        />
        <Select
          data={berthsData}
          value={berth}
          label={t('berth')}
          placeholder={t('selectBerth')}
          searchable
          clearable
          onChange={(value) => {
            if (value) {
              const berth: BerthIdentifier = JSON.parse(value);
              const { locode, port_area_code } = berth;
              setLocode(locode);
              setPortAreaId({ locode, port_area_code });
              setBerthId(berth);
            } else {
              setBerthId(null);
            }
          }}
          styles={(theme) => ({
            groupLabel: {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              boxShadow: theme.shadows.xs,
              backgroundColor:
                colorScheme === 'light' ? theme.white : theme.colors.dark[6],
            },
          })}
        />
        <Select
          label={t('vessel')}
          placeholder={t('selectVessel')}
          data={vesselItems}
          limit={20}
          searchable
          clearable
          value={selectedVessel}
          onChange={setSelectedVessel}
        />
        {selectedVessel && (
          <VesselDetails vessel={JSON.parse(selectedVessel)} />
        )}
        <Select
          label={t('service')}
          placeholder={t('selectService')}
          data={serviceItems}
          value={selectedService}
          onChange={setSelectedService}
        />
        <DateTimePicker
          valueFormat="DD.M.YYYY HH:mm"
          highlightToday={true}
          label={t('time')}
          placeholder={t('selectTime')}
          clearable
          value={selectedTime}
          onChange={setSelectedTime}
        />
        <Group grow>
          <Button variant="outline" onClick={close}>
            {t('cancelButtonLabel')}
          </Button>
          <Button type="submit" loading={insertIsPending}>
            {t('saveButtonLabel')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
