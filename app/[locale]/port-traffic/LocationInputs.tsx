'use client';

import { ComboboxItem, ComboboxItemGroup } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useMemo } from 'react';
import { BerthInput } from './BerthInput';
import { LocodeInput } from './LocodeInput';
import { PortAreaInput } from './PortAreaInput';
import { usePortData } from './PortDataContext';
import { DockingFormValues, PortAreaIdentifier } from '@/lib/types/docking';

export function LocationInputs({
  locode,
  portArea,
  form,
}: {
  form: UseFormReturnType<
    DockingFormValues,
    (values: DockingFormValues) => DockingFormValues
  >;
  locode: string;
  portArea: string;
}) {
  const { locations, portAreas, berths } = usePortData();
  const { portAreaItems, berthsItems } = useMemo(
    () => getInputItems(locations, portAreas, berths, locode, portArea),
    [locations, portAreas, berths, locode, portArea]
  );

  return (
    <>
      <LocodeInput
        locations={locations}
        key={form.key('locode')}
        {...form.getInputProps('locode')}
      />
      <PortAreaInput
        data={portAreaItems}
        key={form.key('portArea')}
        {...form.getInputProps('portArea')}
      />
      <BerthInput
        data={berthsItems}
        key={form.key('berth')}
        {...form.getInputProps('berth')}
      />
    </>
  );
}

function getInputItems(
  locations: AppTypes.Location[],
  portAreas: AppTypes.PortArea[],
  berths: AppTypes.Berth[],
  locode: string,
  portArea: string
) {
  const filteredPortAreas = portAreas.filter((portArea) =>
    locode ? portArea.locode === locode : true
  );

  const portAreaItems = locations.map(
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

  const portAreaId = portArea
    ? (JSON.parse(portArea) as PortAreaIdentifier)
    : null;

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

  const berthsItems = filteredPortAreas.map(
    ({ locode, port_area_code, port_area_name }, index): ComboboxItemGroup => ({
      group: `${filteredPortAreaLocationNames[index]} ${port_area_name}`,
      items: filteredBerths
        .filter(
          (berth) =>
            berth.locode === locode && berth.port_area_code === port_area_code
        )
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

  return { portAreaItems, berthsItems };
}
