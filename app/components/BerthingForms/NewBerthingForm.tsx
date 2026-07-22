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
import { BerthingFormValues, BerthingSubmitValues } from '@/lib/types/berthing';
import { Group, Space } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import useBerthingFormValidation, {
  useBerthingChronologyValidation,
} from '../../hooks/useBerthingFormValidation';
import { BerthingFormFields } from './BerthingFormFields';
import {
  createPortEventInsert,
  hasPortEventDate,
} from '../../../lib/portEventForm';

const initialValues: BerthingFormValues = {
  imo: null,
  vesselName: null,
  arrival: null,
  shiftings: [],
  departure: null,
};

export function NewBerthingForm({
  close,
  onSaved,
}: {
  close(): void;
  onSaved(newBerthingId: string): void;
}) {
  const t = useTranslations('BerthingFormFields');
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getBerthingSavedNotification = useBerthingSavedNotification();
  const { dispatchBerthings } = useBerthings();
  const vessels = useVessels();
  const { setSelectedVessel } = useBerthingInputData();
  const validate = useBerthingFormValidation();
  const validateChronology = useBerthingChronologyValidation();
  const [loading, setLoading] = useState(false);

  const form = useBerthingForm({
    mode: 'uncontrolled',
    initialValues,
    validate,
    validateInputOnBlur: true,
    transformValues: (values): BerthingSubmitValues => ({
      ...values,
      vesselName:
        vessels.find((vessel) => vessel.imo === values.imo)?.name || null,
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

  const submitHandler = async ({
    imo,
    vesselName,
    arrival,
    shiftings,
    departure,
  }: BerthingSubmitValues) => {
    if (imo === null) return;

    const chronologyErrors = validateChronology(form.getValues());

    if (Object.keys(chronologyErrors).length) {
      form.setErrors(chronologyErrors);
      return;
    }

    setLoading(true);

    try {
      const arrivalQuery = arrival
        ? supabase
            .from('port_events')
            .insert(createPortEventInsert(arrival, 'arrival'))
            .select('id')
            .single()
        : null;

      const shiftingsQuery = shiftings.length
        ? supabase
            .from('port_events')
            .insert(
              shiftings.map((event) => createPortEventInsert(event, 'shifting'))
            )
            .select('id')
        : null;

      const departureQuery = departure
        ? supabase
            .from('port_events')
            .insert(createPortEventInsert(departure, 'departure'))
            .select('id')
            .single()
        : null;

      const [arrivalResponse, shiftingsResponse, departureResponse] =
        await Promise.all([arrivalQuery, shiftingsQuery, departureQuery]);

      if (arrivalResponse?.error) {
        showNotification(getErrorNotification(arrivalResponse.status));
        return;
      }

      if (shiftingsResponse?.error) {
        showNotification(getErrorNotification(shiftingsResponse.status));
        return;
      }

      if (departureResponse?.error) {
        showNotification(getErrorNotification(departureResponse.status));
        return;
      }

      const berthingsInsertResponse = await supabase
        .from('berthings')
        .insert({
          vessel_imo: imo,
          vessel_name: vesselName,
          arrival: arrivalResponse?.data.id ?? null,
          departure: departureResponse?.data.id ?? null,
        })
        .select('id')
        .single();

      if (berthingsInsertResponse.error) {
        showNotification(getErrorNotification(berthingsInsertResponse.status));
        return;
      }

      const shiftingLinks =
        shiftingsResponse?.data.map(({ id }) => ({
          berthing: berthingsInsertResponse.data.id,
          port_event: id,
        })) ?? [];

      if (shiftingLinks.length) {
        const { error, status } = await supabase
          .from('berthing_shiftings')
          .insert(shiftingLinks);

        if (error) {
          showNotification(getErrorNotification(status));
          return;
        }
      }

      const berthingsResponse = await supabase
        .from('berthings')
        .select(berthingsSelector)
        .order('port_event(estimated_date)', {
          referencedTable: 'shiftings',
        })
        .order('port_event(estimated_time)', {
          referencedTable: 'shiftings',
          nullsFirst: true,
        })
        .eq('id', berthingsInsertResponse.data.id)
        .single();

      if (berthingsResponse.error) {
        showNotification(getErrorNotification(berthingsResponse.status));
        return;
      }

      dispatchBerthings({ type: 'added', item: berthingsResponse.data });
      onSaved(berthingsResponse.data.id);
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
          closeButtonLabel={t('cancel')}
          closeButtonClickHandler={close}
          resetButtonClickHandler={() => {
            form.reset();
            setSelectedVessel(null);
          }}
          resetButtonDisabled={!form.isDirty()}
          submitButtonDisabled={false}
          submitButtonLoading={loading}
        />
      </Group>
    </form>
  );
}
