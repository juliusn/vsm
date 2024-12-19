'use client';

import {
  ComboboxItem,
  ComboboxItemGroup,
  Select,
  useComputedColorScheme,
} from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useLocationInputs } from './LocationInputContext';
import { PortAreaIdentifier } from './PortAreaInput';

type BerthIdentifier = {
  locode: string;
  port_area_code: string;
  berth_code: string;
};

interface BerthInputProps {
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
}

export function BerthInput({ locations, portAreas, berths }: BerthInputProps) {
  const t = useTranslations('BerthInput');

  const { locode, setLocode, portArea, setPortArea, berth, setBerth } =
    useLocationInputs();
  const colorScheme = useComputedColorScheme();

  const portAreaId = portArea
    ? (JSON.parse(portArea) as PortAreaIdentifier)
    : null;

  const filteredPortAreas = portAreas.filter((portArea) =>
    locode ? portArea.locode === locode : true
  );

  const filteredPortAreaLocationNames = filteredPortAreas.map(
    ({ locode }) =>
      locations.find((location) => location.locode === locode)?.location_name
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

  return (
    <Select
      data={berthsData}
      label={t('berth')}
      placeholder={t('selectBerth')}
      searchable
      clearable
      value={berth}
      onChange={(value) => {
        setBerth(value);
        if (value) {
          const berth: BerthIdentifier = JSON.parse(value);
          const { locode, port_area_code } = berth;
          setLocode(locode);
          setPortArea(JSON.stringify({ locode, port_area_code }));
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
  );
}
