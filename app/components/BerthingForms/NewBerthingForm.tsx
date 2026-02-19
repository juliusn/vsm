'use client';

import { FormButtons } from '@/app/components/FormButtons';
import { useBerthings } from '@/app/context/BerthingContext';
import {
  BerthingFormProvider,
  useBerthingForm,
} from '@/app/context/BerthingFormContext';
import { useBerthingInputData } from '@/app/context/BerthingInputDataContext';
import { useVessels } from '@/app/context/VesselContext';
import {
  useBerthingSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { berthingsSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import {
  BerthIdentifier,
  BerthingFormValues,
  PortAreaIdentifier,
} from '@/lib/types/berthing';
import { Group, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import { useState } from 'react';
import useBerthingFormValidation from '../../hooks/useBerthingFormValidation';
import { BerthingFormFields } from './BerthingFormFields';

const initialValues: BerthingFormValues = {
  vesselName: null,
  imo: null,
  arrivalDate: null,
  arrivalTime: null,
  arrivalLocode: null,
  arrivalPortArea: null,
  arrivalBerth: null,
  arrivalPosition: null,
  departureDate: null,
  departureTime: null,
  departureLocode: null,
  departurePortArea: null,
  departureBerth: null,
};

export function NewBerthingForm({
  close,
  resultCallback,
}: {
  close(): void;
  resultCallback(newBerthingId: string): void;
}) {
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getBerthingSavedNotification = useBerthingSavedNotification();
  const { dispatchBerthings } = useBerthings();
  const vessels = useVessels();
  const { setSelectedVessel } = useBerthingInputData();
  const validate = useBerthingFormValidation();
  const [loading, setLoading] = useState(false);

  const form = useBerthingForm({
    mode: 'uncontrolled',
    initialValues,
    validate,
    validateInputOnBlur: true,
    transformValues: (values) => ({
      ...values,
      vesselName:
        vessels.find((vessel) => vessel.imo === values.imo)?.name || '',
      arrivalPortArea:
        values.arrivalPortArea &&
        (JSON.parse(values.arrivalPortArea) as PortAreaIdentifier)
          .port_area_code,
      arrivalBerth:
        values.arrivalBerth &&
        (JSON.parse(values.arrivalBerth) as BerthIdentifier).berth_code,
      departurePortArea:
        values.departurePortArea &&
        (JSON.parse(values.departurePortArea) as PortAreaIdentifier)
          .port_area_code,
      departureBerth:
        values.departureBerth &&
        (JSON.parse(values.departureBerth) as BerthIdentifier).berth_code,
    }),
  });

  const submitHandler = async ({
    imo,
    vesselName,
    arrivalDate,
    arrivalTime,
    arrivalLocode,
    arrivalPortArea,
    arrivalBerth,
    departureDate,
    departureTime,
    departureLocode,
    departurePortArea,
    departureBerth,
  }: BerthingFormValues) => {
    if (imo === null) return;

    setLoading(true);

    try {
      const arrivalQuery = arrivalDate
        ? supabase
            .from('port_events')
            .insert({
              type: 'arrival',
              estimated_date: dayjs(arrivalDate).format('YYYY-MM-DD'),
              estimated_time: arrivalTime,
              locode: arrivalLocode,
              port_area_code: arrivalPortArea,
              berth_code: arrivalBerth,
            })
            .select()
            .single()
        : null;

      const departureQuery = departureDate
        ? supabase
            .from('port_events')
            .insert({
              type: 'departure',
              estimated_date: dayjs(departureDate).format('YYYY-MM-DD'),
              estimated_time: departureTime,
              locode: departureLocode,
              port_area_code: departurePortArea,
              berth_code: departureBerth,
            })
            .select()
            .single()
        : null;

      const portEventQueries = [arrivalQuery, departureQuery];

      const [arrivalResponse, departureResponse] =
        await Promise.all(portEventQueries);

      if (arrivalResponse?.error) {
        showNotification(getErrorNotification(arrivalResponse.status));
        return;
      }

      if (departureResponse?.error) {
        showNotification(getErrorNotification(departureResponse.status));
        return;
      }

      const berthingsResponse = await supabase
        .from('berthings')
        .insert({
          vessel_imo: imo,
          vessel_name: vesselName,
          arrival: arrivalResponse?.data?.id,
          departure: departureResponse?.data?.id,
        })
        .select(berthingsSelector)
        .single();

      if (berthingsResponse.error) {
        showNotification(getErrorNotification(berthingsResponse.status));
        return;
      }

      dispatchBerthings({ type: 'added', item: berthingsResponse.data });
      resultCallback(berthingsResponse.data.id);
      showNotification(getBerthingSavedNotification());
    } catch {
      showNotification(getErrorNotification(500));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(submitHandler)}>
      <BerthingFormProvider form={form}>
        <BerthingFormFields />
      </BerthingFormProvider>
      <Space h="lg" />
      <Group grow>
        <FormButtons
          closeButtonClickHandler={close}
          resetButtonClickHandler={() => {
            form.reset();
            setSelectedVessel(null);
          }}
          resetButtonDisabled={!form.isDirty()}
          submitButtonDisabled={Boolean(Object.keys(form.errors).length)}
          submitButtonLoading={loading}
        />
      </Group>
    </form>
  );
}
