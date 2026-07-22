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
  BerthingFormValues,
  BerthingSubmitValues,
  PortEventWithDate,
} from '@/lib/types/berthing';
import { TablesInsert } from '@/lib/types/database.types';
import { Berthing } from '@/lib/types/query-types';
import { Group, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useBerthingFormValidation, {
  useBerthingChronologyValidation,
} from '../../hooks/useBerthingFormValidation';
import { FormButtons } from '../FormButtons';
import { BerthingFormFields } from './BerthingFormFields';
import {
  createPortEventFormValue,
  createPortEventInsert,
  hasPortEventDate,
} from '../../../lib/portEventForm';

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
  const t = useTranslations('BerthingFormFields');
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getBerthingSavedNotification = useBerthingSavedNotification();
  const [loading, setLoading] = useState(false);
  const validate = useBerthingFormValidation();
  const validateChronology = useBerthingChronologyValidation();

  const { berthingVessel, selectedVessel, setSelectedVessel } =
    useBerthingInputData();

  const initialValues: BerthingFormValues = {
    imo: initialBerthing.vessel_imo,
    vesselName: initialBerthing.vessel_name,
    arrival: createPortEventFormValue(initialBerthing.arrival),
    shiftings: initialBerthing.shiftings.map(({ port_event }) =>
      createPortEventFormValue(port_event)
    ),
    departure: createPortEventFormValue(initialBerthing.departure),
  };

  const form = useBerthingForm({
    mode: 'uncontrolled',
    initialValues,
    validate,
    validateInputOnBlur: true,
    transformValues: (values) => ({
      ...values,
      vesselName: selectedVessel?.name ?? null,
      arrival:
        values.arrival && hasPortEventDate(values.arrival)
          ? values.arrival
          : null,
      shiftings: values.shiftings.filter(hasPortEventDate),
      departure:
        values.departure && hasPortEventDate(values.departure)
          ? values.departure
          : null,
    }),
  });

  const savePortEvent = async (
    event: PortEventWithDate | null,
    initialId: string | null,
    type: TablesInsert<'port_events'>['type']
  ) => {
    if (!event) {
      if (initialId) {
        const response = await supabase
          .from('port_events')
          .delete()
          .eq('id', initialId);

        if (response.error) return response;
      }

      return { data: null, error: null, status: 200 };
    }

    const payload = createPortEventInsert(event, type);

    return event.id
      ? supabase
          .from('port_events')
          .update(payload)
          .eq('id', event.id)
          .select('id')
          .single()
      : supabase.from('port_events').insert(payload).select('id').single();
  };

  const submitHandler = async ({
    imo,
    vesselName,
    arrival,
    shiftings,
    departure,
  }: BerthingSubmitValues) => {
    if (imo === null) {
      return;
    }

    const chronologyErrors = validateChronology(form.getValues());

    if (Object.keys(chronologyErrors).length) {
      form.setErrors(chronologyErrors);
      return;
    }

    setLoading(true);

    const [arrivalResponse, departureResponse] = await Promise.all([
      savePortEvent(arrival, initialBerthing.arrival?.id ?? null, 'arrival'),
      savePortEvent(
        departure,
        initialBerthing.departure?.id ?? null,
        'departure'
      ),
    ]);

    if (arrivalResponse.error) {
      showNotification(getErrorNotification(arrivalResponse.status));
      setLoading(false);
      return;
    }

    if (departureResponse.error) {
      showNotification(getErrorNotification(departureResponse.status));
      setLoading(false);
      return;
    }

    const initialShiftingIds = initialBerthing.shiftings.map(
      ({ port_event }) => port_event.id
    );

    const existingShiftings = shiftings.filter(
      (event): event is PortEventWithDate & { id: string } => event.id !== null
    );

    const newShiftings = shiftings.filter((event) => event.id === null);

    const submittedIds = new Set(existingShiftings.map(({ id }) => id));

    const removedIds = initialShiftingIds.filter((id) => !submittedIds.has(id));

    const updateResponses = await Promise.all(
      existingShiftings.map((event) =>
        supabase
          .from('port_events')
          .update(createPortEventInsert(event, 'shifting'))
          .eq('id', event.id)
      )
    );

    const failedUpdate = updateResponses.find((response) => response.error);

    if (failedUpdate) {
      showNotification(getErrorNotification(failedUpdate.status));
      setLoading(false);
      return;
    }

    const newShiftingsResponse = newShiftings.length
      ? await supabase
          .from('port_events')
          .insert(
            newShiftings.map((event) =>
              createPortEventInsert(event, 'shifting')
            )
          )
          .select('id')
      : null;

    if (newShiftingsResponse?.error) {
      showNotification(getErrorNotification(newShiftingsResponse.status));
      setLoading(false);
      return;
    }

    const newLinks =
      newShiftingsResponse?.data.map(({ id }) => ({
        berthing: initialBerthing.id,
        port_event: id,
      })) ?? [];

    if (newLinks.length) {
      const response = await supabase
        .from('berthing_shiftings')
        .insert(newLinks);

      if (response.error) {
        showNotification(getErrorNotification(response.status));
        setLoading(false);
        return;
      }
    }

    if (removedIds.length) {
      const linksResponse = await supabase
        .from('berthing_shiftings')
        .delete()
        .eq('berthing', initialBerthing.id)
        .in('port_event', removedIds);

      if (linksResponse.error) {
        showNotification(getErrorNotification(linksResponse.status));
        setLoading(false);
        return;
      }

      const eventsResponse = await supabase
        .from('port_events')
        .delete()
        .in('id', removedIds);

      if (eventsResponse.error) {
        showNotification(getErrorNotification(eventsResponse.status));
        setLoading(false);
        return;
      }
    }

    const arrivalId = arrival ? (arrivalResponse.data?.id ?? arrival.id) : null;

    const departureId = departure
      ? (departureResponse.data?.id ?? departure.id)
      : null;

    const berthingsResponse = await supabase
      .from('berthings')
      .update({
        vessel_imo: imo,
        vessel_name: vesselName,
        arrival: arrivalId,
        departure: departureId,
      })
      .eq('id', initialBerthing.id)
      .select(berthingsSelector)
      .order('port_event(estimated_date)', {
        referencedTable: 'shiftings',
      })
      .order('port_event(estimated_time)', {
        referencedTable: 'shiftings',
        nullsFirst: true,
      })
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
      <BerthingFormProvider form={form}>
        <BerthingFormFields />
      </BerthingFormProvider>
      <Space h="lg" />
      <Group grow>
        <FormButtons
          closeButtonLabel={t('cancel')}
          closeButtonClickHandler={onCancel}
          resetButtonClickHandler={() => {
            form.reset();
            setSelectedVessel(berthingVessel);
          }}
          resetButtonDisabled={!form.isDirty()}
          submitButtonDisabled={!form.isDirty()}
          submitButtonLoading={loading}
          submitButtonLabel={t('saveChanges')}
        />
      </Group>
    </form>
  );
}
