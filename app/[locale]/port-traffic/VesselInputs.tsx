'use client';

import { Collapse, ComboboxItem } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { VesselDetails } from '../orders/VesselDetails';
import { ImoInput } from './ImoInput';
import { FormValues } from './NewDockingForm';
import { VesselNameInput } from './VesselNameInput';

export function VesselInputs({
  vessel,
  form,
  vessels,
  imoRef,
}: {
  form: UseFormReturnType<FormValues, (values: FormValues) => FormValues>;
  vessel: AppTypes.Vessel | undefined;
  vessels: AppTypes.Vessel[];
  imoRef: React.RefObject<HTMLInputElement | null>;
}) {
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
        key={form.key('vesselName')}
        {...form.getInputProps('vesselName')}
      />
      <ImoInput
        key={form.key('imo')}
        {...form.getInputProps('imo')}
        ref={imoRef}
      />
      <Collapse in={!!vessel}>
        {mostRecentVessel && <VesselDetails vessel={mostRecentVessel} />}
      </Collapse>
    </>
  );
}
