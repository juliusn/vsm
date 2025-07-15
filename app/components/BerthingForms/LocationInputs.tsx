'use client';

import { useLocations } from '@/app/context/LocationContext';
import { getLocationInputItems } from '@/lib/getLocationInputItems';
import { UseFormReturnType } from '@mantine/form/lib/types';
import { useMemo } from 'react';
import { BerthInput } from './BerthInput';
import { LocodeInput } from './LocodeInput';
import { PortAreaInput } from './PortAreaInput';

type Fields = {
  locode: string;
  portArea: string;
  berth: string;
};

type Props<T extends Fields> = {
  useFormContext(): UseFormReturnType<T>;
  locode: string;
  portArea: string;
};

export function LocationInputs<T extends Fields>({
  useFormContext,
  locode,
  portArea,
}: Props<T>) {
  const form = useFormContext();

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
        {...form.getInputProps('locode')}
        key={form.key('locode')}
      />
      <PortAreaInput
        data={portAreaItems}
        {...form.getInputProps('portArea')}
        key={form.key('portArea')}
      />
      <BerthInput
        data={berthsItems}
        {...form.getInputProps('berth')}
        key={form.key('berth')}
      />
    </>
  );
}
