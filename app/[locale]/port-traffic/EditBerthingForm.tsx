'use client';

import { FormButtons } from '@/app/components/FormButtons';
import { useBerthings } from '@/app/context/BerthingContext';
import { useVessels } from '@/app/context/VesselContext';
import {
  useBerthingSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { berthingsQuery } from '@/lib/queries';
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
import { PostgrestBuilder } from '@supabase/postgrest-js';
import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import { useRef, useState } from 'react';
import useBerthingFormValidation from '../../hooks/useBerthingFormValidation';
import { BerthingFormFields } from './BerthingFormFields';

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
  const vesselMatch = vessels.find(
    (vessel) => vessel.imo === berthingRow.vessel_imo
  );
  const [loading, setLoading] = useState(false);
  const [vessel, setVessel] = useState<AppTypes.Vessel | undefined>(
    vesselMatch
  );
  const [locode, setLocode] = useState(berthingRow.locode || '');
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
  const validate = useBerthingFormValidation();
  const imoRef = useRef<HTMLInputElement>(null);
  const initialValues: BerthingFormValues = {
    vesselName: berthingRow.vessel_imo.toString(),
    imo: berthingRow.vessel_imo,
    locode: berthingRow.locode || '',
    portArea: portAreaIdentifier ? JSON.stringify(portAreaIdentifier) : '',
    berth: berthIdentifier ? JSON.stringify(berthIdentifier) : '',
    etaDate: berthingRow.arrival
      ? dayjs(berthingRow.arrival.estimated_date).toDate()
      : '',
    etaTime: berthingRow.arrival?.estimated_time || '',
    etdDate: berthingRow.departure
      ? dayjs(berthingRow.departure.estimated_date).toDate()
      : '',
    etdTime: berthingRow.departure?.estimated_time || '',
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

    setLoading(true);

    const queries: PostgrestBuilder<null>[] = [];

    try {
      const berthingsResponse = await supabase
        .from('berthings')
        .update({
          vessel_imo: imo,
          vessel_name: vesselName || null,
          locode: locode || null,
          port_area_code: portArea || null,
          berth_code: berth || null,
        })
        .eq('id', berthingRow.id)
        .select()
        .single();

      if (berthingsResponse.error) {
        showNotification(getErrorNotification(berthingsResponse.status));
        return;
      }

      handlePortEvent(
        berthingRow.arrival,
        etaDate,
        etaTime,
        berthingsResponse.data.id,
        'arrival'
      );

      handlePortEvent(
        berthingRow.departure,
        etdDate,
        etdTime,
        berthingsResponse.data.id,
        'departure'
      );

      const responses = await Promise.all(queries);

      for (const response of responses) {
        if (response.error) {
          showNotification(getErrorNotification(berthingsResponse.status));
          return;
        }
      }

      const { data, error, status } = await supabase
        .from('berthings')
        .select(berthingsQuery)
        .eq('id', berthingRow.id)
        .single();

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      dispatchBerthings({ type: 'changed', item: data });
      showNotification(getBerthingSavedNotification());
      resultCallback(data);
    } catch {
      showNotification(getErrorNotification(500));
    } finally {
      setLoading(false);
    }

    async function handlePortEvent(
      portEvent: Omit<AppTypes.PortEvent, 'berthing'> | null,
      date: Date | '',
      time: string,
      berthing: string,
      type: AppTypes.PortEvent['type']
    ) {
      if (portEvent) {
        if (date) {
          if (
            !dayjs(date).isSame(portEvent.estimated_date, 'day') ||
            time !== (portEvent.estimated_time || '')
          ) {
            queries.push(
              supabase
                .from('port_events')
                .update({
                  estimated_date: dayjs(date).format('YYYY-MM-DD'),
                  estimated_time: time || null,
                })
                .eq('id', portEvent.id)
            );
          }
        } else {
          queries.push(
            supabase.from('port_events').delete().eq('id', portEvent.id)
          );
        }
      } else {
        if (date) {
          queries.push(
            supabase.from('port_events').insert({
              berthing,
              type,
              estimated_date: dayjs(date).format('YYYY-MM-DD'),
              estimated_time: time || null,
            })
          );
        }
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(submitHandler)}>
      <Stack>
        <BerthingFormFields
          form={form}
          vessel={vessel}
          imoRef={imoRef}
          locode={locode}
          portArea={portArea}
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
