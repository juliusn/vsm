'use client';

import { FormButtons } from '@/app/components/FormButtons';
import { useBerthings } from '@/app/context/BerthingContext';
import { useVessels } from '@/app/context/VesselContext';
import {
  useBerthingSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { portEventQueryFactory } from '@/lib/portEventQueryFactory';
import { berthingsSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import {
  BerthIdentifier,
  BerthingFormValues,
  BerthingRowData,
  PortAreaIdentifier,
} from '@/lib/types/berthing';
import { Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import { useRef, useState } from 'react';
import useBerthingFormValidation from '../../hooks/useBerthingFormValidation';
import { BerthingFormFields } from '../../components/BerthingFormFields';

interface EditBerthingContentProps {
  berthingRow: BerthingRowData;
  onCancel(): void;
  resultCallback(data: AppTypes.Berthing): void;
}

export function EditBerthingForm({
  berthingRow,
  onCancel,
  resultCallback,
}: EditBerthingContentProps) {
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getBerthingSavedNotification = useBerthingSavedNotification();
  const { dispatchBerthings } = useBerthings();
  const vessels = useVessels();
  const [loading, setLoading] = useState(false);
  const [locode, setLocode] = useState(berthingRow.locode || '');
  const validate = useBerthingFormValidation();
  const imoRef = useRef<HTMLInputElement>(null);

  const vesselMatch = vessels.find(
    (vessel) => vessel.imo === berthingRow.vessel_imo
  );

  const [vessel, setVessel] = useState<AppTypes.Vessel | undefined>(
    vesselMatch
  );

  const portAreaIdentifier: PortAreaIdentifier | null =
    berthingRow.locode && berthingRow.port_area_code
      ? {
          locode: berthingRow.locode,
          port_area_code: berthingRow.port_area_code,
        }
      : null;

  const berthIdentifier: BerthIdentifier | null =
    berthingRow.locode && berthingRow.port_area_code && berthingRow.berth_code
      ? {
          locode: berthingRow.locode,
          port_area_code: berthingRow.port_area_code,
          berth_code: berthingRow.berth_code,
        }
      : null;

  const [portArea, setPortArea] = useState(
    portAreaIdentifier ? JSON.stringify(portAreaIdentifier) : ''
  );

  const initialValues: BerthingFormValues = {
    vesselName: berthingRow.vessel_imo.toString(),
    imo: berthingRow.vessel_imo,
    locode: berthingRow.locode || '',
    portArea: portAreaIdentifier ? JSON.stringify(portAreaIdentifier) : '',
    berth: berthIdentifier ? JSON.stringify(berthIdentifier) : '',
    etaDate: berthingRow.arrival
      ? dayjs(berthingRow.arrival.estimated_date).toDate()
      : '',
    etaTime: berthingRow.arrival?.estimated_time
      ? berthingRow.arrival.estimated_time.slice(0, 5)
      : '',
    etdDate: berthingRow.departure
      ? dayjs(berthingRow.departure.estimated_date).toDate()
      : '',
    etdTime: berthingRow.departure?.estimated_time
      ? berthingRow.departure.estimated_time.slice(0, 5)
      : '',
  };

  const form = useForm<BerthingFormValues>({
    mode: 'uncontrolled',
    initialValues,
    validate,
    validateInputOnBlur: true,
    transformValues: (values) => ({
      ...values,
      vesselName: vessel?.name || '',
      portArea:
        values.portArea &&
        (JSON.parse(values.portArea) as PortAreaIdentifier).port_area_code,
      berth:
        values.berth &&
        (JSON.parse(values.berth) as BerthIdentifier).berth_code,
    }),
  });

  form.watch('vesselName', ({ value }) => {
    if (value) {
      form.setFieldValue('imo', Number(value));
      setTimeout(() => {
        imoRef.current?.select();
      }, 0);
    } else {
      form.setFieldValue('imo', '');
      form.getInputNode('vesselName')?.focus();
    }
  });

  form.watch('imo', ({ value }) => {
    const match = vessels.find((vessel) => vessel.imo === value);
    setVessel(match);
    if (match) {
      form.setFieldValue('vesselName', match.imo.toString());
    }
  });

  form.watch('locode', ({ previousValue, value }) => {
    setLocode(value);
    if (previousValue && previousValue !== value) {
      form.setFieldValue('portArea', '');
      form.setFieldValue('berth', '');
    }
  });

  form.watch('portArea', ({ previousValue, value }) => {
    setPortArea(value);
    if (previousValue && previousValue !== value) {
      form.setFieldValue('berth', '');
    }
    if (value) {
      const { locode }: PortAreaIdentifier = JSON.parse(value);
      form.setFieldValue('locode', locode);
    }
  });

  form.watch('berth', ({ value }) => {
    if (value) {
      const { locode, port_area_code }: BerthIdentifier = JSON.parse(value);
      form.setFieldValue('locode', locode);
      const portArea: PortAreaIdentifier = { locode, port_area_code };
      form.setFieldValue('portArea', JSON.stringify(portArea));
    }
  });

  const submitHandler = async ({
    imo,
    vesselName,
    locode,
    portArea,
    berth,
    etaDate,
    etaTime,
    etdDate,
    etdTime,
  }: BerthingFormValues) => {
    if (imo === '') {
      return;
    }

    const berthingsQuery = supabase
      .from('berthings')
      .update({
        vessel_imo: imo,
        vessel_name: vesselName || null,
        locode: locode || null,
        port_area_code: portArea || null,
        berth_code: berth || null,
      })
      .eq('id', berthingRow.id);

    const arrivalQuery = portEventQueryFactory({
      berthing: berthingRow.id,
      portEvent: berthingRow.arrival,
      type: 'arrival',
      newValues: { date: etaDate, time: etaTime },
    })?.(supabase);

    const departureQuery = portEventQueryFactory({
      berthing: berthingRow.id,
      portEvent: berthingRow.departure,
      type: 'departure',
      newValues: { date: etdDate, time: etdTime },
    })?.(supabase);

    setLoading(true);

    const updateResponses = await Promise.all([
      berthingsQuery,
      arrivalQuery,
      departureQuery,
    ]);

    const berthingsResponse = await supabase
      .from('berthings')
      .select(berthingsSelector)
      .eq('id', berthingRow.id)
      .single();

    setLoading(false);

    if (berthingsResponse.data) {
      dispatchBerthings({ type: 'changed', item: berthingsResponse.data });
      resultCallback(berthingsResponse.data);
    }

    for (const response of [...updateResponses, berthingsResponse]) {
      if (response?.error) {
        showNotification(getErrorNotification(berthingsResponse.status));
        return;
      }
    }

    showNotification(getBerthingSavedNotification());
  };

  return (
    <form onSubmit={form.onSubmit(submitHandler)}>
      <Stack>
        <BerthingFormFields
          vesselInputsProps={{
            vessel: vessel,
            vesselNameProps: form.getInputProps('vesselName'),
            vesselNameKey: form.key('vesselName'),
            imoProps: form.getInputProps('imo'),
            imoKey: form.key('imo'),
            imoRef: imoRef,
          }}
          locationInputsProps={{
            locode,
            portArea,
            locodeProps: form.getInputProps('locode'),
            locodeKey: form.key('locode'),
            portAreaProps: form.getInputProps('portArea'),
            portAreaKey: form.key('portArea'),
            berthProps: form.getInputProps('berth'),
            berthKey: form.key('berth'),
          }}
          etaDateProps={form.getInputProps('etaDate')}
          etaDateKey={form.key('etaDate')}
          etaTimeProps={form.getInputProps('etaTime')}
          etaTimeKey={form.key('etaTime')}
          etdDateProps={form.getInputProps('etdDate')}
          etdDateKey={form.key('etdDate')}
          etdTimeProps={form.getInputProps('etdTime')}
          etdTimeKey={form.key('etdTime')}
        />
        <Group grow>
          <FormButtons
            cancelButtonClickHandler={onCancel}
            resetButtonClickHandler={() => {
              form.reset();
              setVessel(vesselMatch);
            }}
            resetButtonDisabled={!form.isDirty()}
            submitButtonDisabled={
              !form.isDirty() || Boolean(Object.keys(form.errors).length)
            }
            submitButtonLoading={loading}
          />
        </Group>
      </Stack>
    </form>
  );
}
