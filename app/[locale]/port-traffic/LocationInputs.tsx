'use client';

import { getLocationInputItems } from '@/lib/getLocationInputItems';
import { BerthingFormValues } from '@/lib/types/berthing';
import { UseFormReturnType } from '@mantine/form';
import { useMemo } from 'react';
import { BerthInput } from './BerthInput';
import { LocodeInput } from './LocodeInput';
import { PortAreaInput } from './PortAreaInput';
import { useLocations } from '@/app/context/LocationContext';

export function LocationInputs({
  locode,
  portArea,
  form,
}: {
  form: UseFormReturnType<
    BerthingFormValues,
    (values: BerthingFormValues) => BerthingFormValues
  >;
  locode: string;
  portArea: string;
}) {
  const {
    state: { locations, portAreas, berths },
  } = useLocations();
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
