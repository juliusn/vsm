'use client';

import { getLocationInputItems } from '@/lib/getLocationInputItems';
import { DockingFormValues } from '@/lib/types/docking';
import { UseFormReturnType } from '@mantine/form';
import { useMemo } from 'react';
import { BerthInput } from './BerthInput';
import { LocodeInput } from './LocodeInput';
import { PortAreaInput } from './PortAreaInput';
import { useLocations } from '../../context/LocationContext';

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
  const { locations, portAreas, berths } = useLocations();
  const { portAreaItems, berthsItems } = useMemo(
    () => getLocationInputItems(locations, portAreas, berths, locode, portArea),
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
