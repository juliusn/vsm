'use client';

import { useBerthingInputData } from '@/app/context/BerthingInputDataContext';
import { useBerthingFormContext } from '@/app/context/BerthingFormContext';
import { useVessels } from '@/app/context/VesselContext';
import { Vessel } from '@/lib/types/vessel';
import { Collapse, ComboboxItem, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { ImoInput } from './ImoInput';
import { VesselDetails } from './VesselDetails';
import { VesselNameInput } from './VesselNameInput';

export function VesselInputs() {
  const vessels = useVessels();
  const form = useBerthingFormContext();

  const { selectedVessel, setSelectedVessel, imoInputRef } =
    useBerthingInputData();

  const vesselItems = vessels.map(
    (vessel): ComboboxItem => ({
      value: vessel.imo.toString(),
      label: vessel.name,
    })
  );

  const [mostRecentVessel, setMostRecentVessel] = useState<Vessel | null>(
    selectedVessel
  );

  const [opened, { open, close }] = useDisclosure(!!mostRecentVessel);

  form.watch('vesselName', ({ value }) => {
    if (value) {
      form.setFieldValue('imo', Number(value));
      setTimeout(() => {
        imoInputRef.current?.select();
      }, 0);
    } else {
      form.setFieldValue('imo', null);
      form.getInputNode('vesselName')?.focus();
    }
  });

  form.watch('imo', ({ value }) => {
    const match = vessels.find((vessel) => vessel.imo === value);
    setSelectedVessel(match || null);
    if (match) {
      form.setFieldValue('vesselName', match.imo.toString());
    }
  });

  useEffect(() => {
    if (selectedVessel) {
      open();
      setMostRecentVessel(selectedVessel);
    } else {
      close();
    }
  }, [selectedVessel, open, close]);

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
        ref={imoInputRef}
      />
      <Collapse in={opened}>
        <Paper withBorder shadow="sm">
          {mostRecentVessel && <VesselDetails vessel={mostRecentVessel} />}
        </Paper>
      </Collapse>
    </>
  );
}
