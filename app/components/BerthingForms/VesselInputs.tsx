'use client';

import { useVessels } from '@/app/context/VesselContext';
import { Vessel } from '@/lib/types/vessel';
import { Collapse, ComboboxItem, Paper } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { ImoInput } from './ImoInput';
import { VesselDetails } from './VesselDetails';
import { VesselNameInput } from './VesselNameInput';

type Fields = {
  vesselName: string;
  imo: number | '';
};

type Props<T extends Fields> = {
  useFormContext(): UseFormReturnType<T>;
  vessel: Vessel | undefined;
  imoRef: React.RefObject<HTMLInputElement | null>;
};

export function VesselInputs<T extends Fields>({
  vessel,
  imoRef,
  useFormContext,
}: Props<T>) {
  const vessels = useVessels();
  const form = useFormContext();

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

  const [mostRecentVessel, setMostRecentVessel] = useState<Vessel | undefined>(
    undefined
  );

  useEffect(() => {
    if (vessel) {
      setMostRecentVessel(vessel);
    }
  }, [vessel]);

  return (
    <>
      <VesselNameInput
        data={vesselItems}
        {...form.getInputProps('vesselName')}
        key={form.key('vesselName')}
      />
      <ImoInput
        {...form.getInputProps('imo')}
        key={form.key('imo')}
        ref={imoRef}
      />
      <Collapse in={!!vessel}>
        <Paper withBorder shadow="sm">
          {mostRecentVessel && <VesselDetails vessel={mostRecentVessel} />}
        </Paper>
      </Collapse>
    </>
  );
}
