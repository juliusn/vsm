'use client';

import {
  ComboboxItem,
  ComboboxItemGroup,
  Select,
  useComputedColorScheme,
} from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useLocationInputs } from './LocationInputContext';

export type PortAreaIdentifier = {
  locode: string;
  port_area_code: string;
};

interface PortAreaFieldProps {
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
}

export function PortAreaInput({ locations, portAreas }: PortAreaFieldProps) {
  const t = useTranslations('PortAreaInput');
  const colorScheme = useComputedColorScheme();
  const { locode, setLocode, portArea, setPortArea, setBerth } =
    useLocationInputs();

  const filteredPortAreas = portAreas.filter((portArea) =>
    locode ? portArea.locode === locode : true
  );

  const portAreaData = locations.map(
    ({ location_name }): ComboboxItemGroup => ({
      group: location_name,
      items: filteredPortAreas.map(
        ({ locode, port_area_code, port_area_name }): ComboboxItem => ({
          value: JSON.stringify({ locode, port_area_code }),
          label: `${port_area_code} - ${port_area_name}`,
        })
      ),
    })
  );

  return (
    <Select
      data={portAreaData}
      label={t('portArea')}
      placeholder={t('selectPortArea')}
      searchable
      clearable
      value={portArea}
      onChange={(value) => {
        setPortArea(value);
        if (value) {
          const { locode }: PortAreaIdentifier = JSON.parse(value);
          setLocode(locode);
        } else {
          setBerth(null);
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
