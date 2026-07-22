import { useLocations } from '@/app/context/LocationContext';
import { getLocationInputItems } from '@/lib/getLocationInputItems';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { useMemo } from 'react';
import { BerthInput } from './BerthInput';
import { LocodeInput } from './LocodeInput';
import { PortAreaInput } from './PortAreaInput';

interface Props {
  locode: string | null;
  portArea: string | null;
  locodeInputProps: GetInputPropsReturnType;
  locodeInputKey: string;
  portAreaInputProps: GetInputPropsReturnType;
  portAreaInputKey: string;
  berthInputProps: GetInputPropsReturnType;
  berthInputKey: string;
}

export function LocationInputs({
  locode,
  portArea,
  locodeInputProps,
  locodeInputKey,
  portAreaInputProps,
  portAreaInputKey,
  berthInputProps,
  berthInputKey,
}: Props) {
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
        {...locodeInputProps}
        key={locodeInputKey}
      />
      <PortAreaInput
        data={portAreaItems}
        {...portAreaInputProps}
        key={portAreaInputKey}
      />
      <BerthInput data={berthsItems} {...berthInputProps} key={berthInputKey} />
    </>
  );
}
