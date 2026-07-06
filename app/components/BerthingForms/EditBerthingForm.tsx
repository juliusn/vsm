'use client';

import {
  BerthingFormProvider,
  useBerthingForm,
} from '@/app/context/BerthingFormContext';
import { useBerthingInputData } from '@/app/context/BerthingInputDataContext';
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
import { TablesInsert } from '@/lib/types/database.types';
import { Berthing } from '@/lib/types/query-types';
import { Group, Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import { useState } from 'react';
import useBerthingFormValidation from '../../hooks/useBerthingFormValidation';
import { FormButtons } from '../FormButtons';
import { BerthingFormFields } from './BerthingFormFields';

interface EditBerthingFormProps {
  initialBerthing: Berthing;
  onCancel(): void;
  onSaved(data: Berthing): void;
}

export function EditBerthingForm({
  initialBerthing,
  onCancel,
  onSaved,
}: EditBerthingFormProps) {
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getBerthingSavedNotification = useBerthingSavedNotification();
  const [loading, setLoading] = useState(false);
  const validate = useBerthingFormValidation();

  const {
    berthingVessel,
    selectedVessel,
    setSelectedVessel,
    arrivalPortAreaIdentifier,
    arrivalBerthIdentifier,
    departurePortAreaIdentifier,
    departureBerthIdentifier,
  } = useBerthingInputData();

  const initialValues: BerthingFormValues = {
    imo: initialBerthing.vessel_imo ?? null,
    vesselName: initialBerthing.vessel_imo.toString() ?? null,
    arrivalDate: initialBerthing.arrival?.estimated_date ?? null,
    arrivalTime: initialBerthing.arrival?.estimated_time
      ? initialBerthing.arrival.estimated_time.slice(0, 5)
      : null,
    arrivalLocode: initialBerthing.arrival?.locode ?? null,
    arrivalPortArea: arrivalPortAreaIdentifier
      ? JSON.stringify(arrivalPortAreaIdentifier)
      : null,
    arrivalBerth: arrivalBerthIdentifier
      ? JSON.stringify(arrivalBerthIdentifier)
      : null,
    arrivalPosition: initialBerthing.arrival?.position ?? null,
    departureDate: initialBerthing.departure?.estimated_date ?? null,
    departureTime: initialBerthing.departure?.estimated_time
      ? initialBerthing.departure.estimated_time.slice(0, 5)
      : null,
    departureLocode: initialBerthing.departure?.locode ?? null,
    departurePortArea: departurePortAreaIdentifier
      ? JSON.stringify(departurePortAreaIdentifier)
      : null,
    departureBerth: departureBerthIdentifier
      ? JSON.stringify(departureBerthIdentifier)
      : null,
  };

  const form = useBerthingForm({
    mode: 'uncontrolled',
    initialValues,
    validate,
    validateInputOnBlur: true,
    transformValues: (values) => ({
      ...values,
      vesselName: selectedVessel?.name || null,
      arrivalTime: values.arrivalTime ? `${values.arrivalTime}:00` : null,
      arrivalPortArea:
        values.arrivalPortArea &&
        (JSON.parse(values.arrivalPortArea) as PortAreaIdentifier)
          .port_area_code,
      arrivalBerth:
        values.arrivalBerth &&
        (JSON.parse(values.arrivalBerth) as BerthIdentifier).berth_code,
      departureTime: values.departureTime ? `${values.departureTime}:00` : null,
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
    arrivalPosition,
    departureDate,
    departureTime,
    departureLocode,
    departurePortArea,
    departureBerth,
  }: BerthingFormValues) => {
    if (imo === null) {
      return;
    }

    const arrivalValues: TablesInsert<'port_events'> = {
      type: 'arrival',
      estimated_date: dayjs(arrivalDate).format('YYYY-MM-DD'),
      estimated_time: arrivalTime || null,
      locode: arrivalLocode || null,
      port_area_code: arrivalPortArea || null,
      berth_code: arrivalBerth || null,
      position: arrivalPosition || null,
    };

    const departureValues: TablesInsert<'port_events'> = {
      type: 'departure',
      estimated_date: dayjs(departureDate).format('YYYY-MM-DD'),
      estimated_time: departureTime || null,
      locode: departureLocode || null,
      port_area_code: departurePortArea || null,
      berth_code: departureBerth || null,
    };

    const { arrival, departure } = initialBerthing;

    const arrivalFields = Object.keys(arrivalValues) as Array<
      keyof TablesInsert<'port_events'>
    >;

    const changedArrivalFields = arrivalFields.filter((key) =>
      arrival ? arrivalValues[key] !== arrival[key] : key
    );

    const arrivalPayload = changedArrivalFields.reduce<
      Partial<TablesInsert<'port_events'>>
    >((payload, key) => ({ ...payload, [key]: arrivalValues[key] }), {});

    const departureFields = Object.keys(departureValues) as Array<
      keyof typeof departureValues
    >;

    const changedDepartureFields = departureFields.filter((key) =>
      departure ? departureValues[key] !== departure[key] : key
    );

    const departurePayload = changedDepartureFields.reduce<
      Partial<TablesInsert<'port_events'>>
    >((payload, key) => ({ ...payload, [key]: departureValues[key] }), {});

    const arrivalQuery = arrival
      ? arrivalDate
        ? changedArrivalFields.length
          ? supabase
              .from('port_events')
              .update(arrivalPayload)
              .eq('id', arrival.id)
              .select('id')
              .single()
          : null
        : supabase.from('port_events').delete().eq('id', arrival.id)
      : arrivalDate
        ? supabase
            .from('port_events')
            .insert(arrivalValues)
            .select('id')
            .single()
        : null;

    const departureQuery = departure
      ? departureDate
        ? changedDepartureFields.length
          ? supabase
              .from('port_events')
              .update(departurePayload)
              .eq('id', departure.id)
              .select('id')
              .single()
          : null
        : supabase.from('port_events').delete().eq('id', departure.id)
      : departureDate
        ? supabase
            .from('port_events')
            .insert(departureValues)
            .select('id')
            .single()
        : null;

    setLoading(true);

    const [arrivalResponse, departureResponse] = await Promise.all([
      arrivalQuery,
      departureQuery,
    ]);

    if (arrivalResponse?.error) {
      showNotification(getErrorNotification(arrivalResponse.status));
      setLoading(false);
      return;
    }

    if (departureResponse?.error) {
      showNotification(getErrorNotification(departureResponse.status));
      setLoading(false);
      return;
    }

    const berthingsPayload = {
      vessel_imo: imo,
      vessel_name: vesselName || null,
      arrival: arrivalDate ? arrivalResponse?.data?.id || arrival?.id : null,
      departure: departureDate
        ? departureResponse?.data?.id || departure?.id
        : null,
    };

    const berthingsResponse = await supabase
      .from('berthings')
      .update(berthingsPayload)
      .eq('id', initialBerthing.id)
      .select(berthingsSelector)
      .single();

    setLoading(false);

    if (berthingsResponse.error) {
      showNotification(getErrorNotification(berthingsResponse.status));
      return;
    }

    onSaved(berthingsResponse.data);
    showNotification(getBerthingSavedNotification());
  };

  return (
    <form
      onSubmit={(event) => {
        event.stopPropagation();
        form.onSubmit(submitHandler)(event);
      }}>
      <Stack>
        <BerthingFormProvider form={form}>
          <BerthingFormFields />
        </BerthingFormProvider>
        <Group grow>
          <FormButtons
            closeButtonClickHandler={onCancel}
            resetButtonClickHandler={() => {
              form.reset();
              setSelectedVessel(berthingVessel);
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
