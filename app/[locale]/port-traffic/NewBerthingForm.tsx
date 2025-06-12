'use client';

import { FormButtons } from '@/app/components/FormButtons';
import { useVessels } from '@/app/context/VesselContext';
import {
  useBerthingSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
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
import { useBerthings } from '@/app/context/BerthingContext';
import useBerthingFormValidation from '../../hooks/useBerthingFormValidation';
import { BerthingFormFields } from './BerthingFormFields';

const initialValues: BerthingFormValues = {
  vesselName: '',
  imo: '',
  locode: '',
  portArea: '',
  berth: '',
  etaDate: '',
  etaTime: '',
  etdDate: '',
  etdTime: '',
};

interface NewBerthingContentProps {
  close(): void;
  resultCallback?: (data: BerthingRowData) => void;
}

export function NewBerthingForm({
  close,
  resultCallback,
}: NewBerthingContentProps) {
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getBerthingSavedNotification = useBerthingSavedNotification();
  const { dispatchBerthings, dispatchPortEvents } = useBerthings();
  const vessels = useVessels();
  const [loading, setLoading] = useState(false);
  const [imoValue, setImoValue] = useState<BerthingFormValues['imo']>('');
  const [vessel, setVessel] = useState<AppTypes.Vessel | undefined>();
  const [locode, setLocode] = useState(initialValues.locode);
  const [portArea, setPortArea] = useState(initialValues.portArea);
  const validate = useBerthingFormValidation();
  const imoRef = useRef<HTMLInputElement>(null);

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
    setImoValue(value);
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

  form.watch('etaDate', () => {
    form.validateField('etdDate');
  });

  form.watch('etaTime', () => {
    form.validateField('etdTime');
  });

  form.watch('etdDate', () => {
    form.validateField('etaDate');
  });

  form.watch('etdTime', () => {
    form.validateField('etaTime');
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

    try {
      const berhingsResponse = await supabase
        .from('berthings')
        .insert({
          vessel_imo: imo,
          vessel_name: vesselName || null,
          locode: locode || null,
          port_area_code: portArea || null,
          berth_code: berth || null,
        })
        .select()
        .single();

      if (berhingsResponse.data) {
        dispatchBerthings({ type: 'added', item: berhingsResponse.data });
      }

      if (berhingsResponse.error) {
        showNotification(getErrorNotification(berhingsResponse.status));
        return;
      }

      const queries = [];

      if (etaDate) {
        queries.push(
          supabase
            .from('port_events')
            .insert({
              berthing: berhingsResponse.data.id,
              type: 'arrival',
              estimated_date: dayjs(etaDate).format('YYYY-MM-DD'),
              estimated_time: etaTime || null,
            })
            .select()
            .single()
        );
      }

      if (etdDate) {
        queries.push(
          supabase
            .from('port_events')
            .insert({
              berthing: berhingsResponse.data.id,
              type: 'departure',
              estimated_date: dayjs(etaDate).format('YYYY-MM-DD'),
              estimated_time: etdTime || null,
            })
            .select()
            .single()
        );
      }

      const portEventsResponse = await Promise.all(queries);
      portEventsResponse.forEach((response) => {
        if (response.data) {
          dispatchPortEvents({ type: 'added', item: response.data });
        }
      });

      for (const response of portEventsResponse) {
        if (response.error) {
          showNotification(getErrorNotification(berhingsResponse.status));
          return;
        }
      }
      const [arrival, departure] = portEventsResponse.map(
        (response) => response.data
      );

      const resultData: BerthingRowData = {
        ...berhingsResponse.data,
        created: new Date(berhingsResponse.data.created_at),
        arrival,
        departure,
      };

      resultCallback?.(resultData);
      showNotification(getBerthingSavedNotification());
      close();
    } catch {
      showNotification(getErrorNotification(500));
    } finally {
      setLoading(false);
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
            cancelButtonClickHandler={close}
            resetButtonClickHandler={() => {
              form.reset();
              setVessel(undefined);
            }}
            resetButtonDisabled={!form.isDirty()}
            submitButtonDisabled={
              !imoValue || Boolean(Object.keys(form.errors).length)
            }
            submitButtonLoading={loading}
          />
        </Group>
      </Stack>
    </form>
  );
}
