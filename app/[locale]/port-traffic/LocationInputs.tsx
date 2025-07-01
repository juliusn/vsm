'use client';

import { useLocations } from '@/app/context/LocationContext';
import { getLocationInputItems } from '@/lib/getLocationInputItems';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { useMemo } from 'react';
import { BerthInput } from './BerthInput';
import { LocodeInput } from './LocodeInput';
import { PortAreaInput } from './PortAreaInput';

export function LocationInputs({
  locode,
  portArea,
  locodeProps,
  locodeKey,
  portAreaProps,
  portAreaKey,
  berthProps,
  berthKey,
}: {
  locode: string;
  portArea: string;
  locodeProps: GetInputPropsReturnType;
  locodeKey: string;
  portAreaProps: GetInputPropsReturnType;
  portAreaKey: string;
  berthProps: GetInputPropsReturnType;
  berthKey: string;
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
      <LocodeInput locations={locations} {...locodeProps} key={locodeKey} />
      <PortAreaInput
        data={portAreaItems}
        {...portAreaProps}
        key={portAreaKey}
      />
      <BerthInput data={berthsItems} {...berthProps} key={berthKey} />
    </>
  );
}
