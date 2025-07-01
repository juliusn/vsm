'use client';

import { useVessels } from '@/app/context/VesselContext';
import { Collapse, ComboboxItem, Paper } from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { useEffect, useMemo, useState } from 'react';
import { VesselDetails } from '../orders/VesselDetails';
import { ImoInput } from './ImoInput';
import { VesselNameInput } from './VesselNameInput';

export function VesselInputs({
  vessel,
  vesselNameProps,
  vesselNameKey,
  imoProps,
  imoKey,
  imoRef,
}: {
  vessel: AppTypes.Vessel | undefined;
  vesselNameProps: GetInputPropsReturnType;
  vesselNameKey: string;
  imoProps: GetInputPropsReturnType;
  imoKey: string;
  imoRef: React.RefObject<HTMLInputElement | null>;
}) {
  const vessels = useVessels();

  const vesselItems = useMemo(
    () =>
      vessels.map(
        (vessel): ComboboxItem => ({
          value: vessel.imo.toString(),
          label: vessel.name,
        })
      ),
    [vessels]
  );

  const [mostRecentVessel, setMostRecentVessel] = useState<
    AppTypes.Vessel | undefined
  >(undefined);

  useEffect(() => {
    if (vessel) {
      setMostRecentVessel(vessel);
    }
  }, [vessel]);

  return (
    <>
      <VesselNameInput
        data={vesselItems}
        {...vesselNameProps}
        key={vesselNameKey}
      />
      <ImoInput {...imoProps} key={imoKey} ref={imoRef} />
      <Collapse in={!!vessel}>
        <Paper withBorder shadow="sm">
          {mostRecentVessel && <VesselDetails vessel={mostRecentVessel} />}
        </Paper>
      </Collapse>
    </>
  );
}
