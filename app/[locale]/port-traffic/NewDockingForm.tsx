'use client';

import { FormButtons } from '@/app/components/FormButtons';
import {
  useDockingSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import {
  BerthIdentifier,
  DockingFormValues,
  PortAreaIdentifier,
} from '@/lib/types/docking';
import { Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import { useRef, useState } from 'react';
import { useDockings } from '../orders/DockingContext';
import { DockingFormFields } from './DockingFormFields';
import { useLocations } from './LocationContext';
import useDockingFormValidation from '../../hooks/useDockingFormValidation';

const initialValues: DockingFormValues = {
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

interface NewDockingContentProps {
  close: () => void;
}

export function NewDockingForm({ close }: NewDockingContentProps) {
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getDockingSavedNotification = useDockingSavedNotification();
  const { dispatchDockings, dispatchDockingEvents } = useDockings();
  const { vessels } = useLocations();
  const [loading, setLoading] = useState(false);
  const [imoValue, setImoValue] = useState<DockingFormValues['imo']>('');
  const [vessel, setVessel] = useState<AppTypes.Vessel | undefined>();
  const [locode, setLocode] = useState(initialValues.locode);
  const [portArea, setPortArea] = useState(initialValues.portArea);
  const validate = useDockingFormValidation();
  const imoRef = useRef<HTMLInputElement>(null);

  const form = useForm<DockingFormValues>({
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

  const newDockingSubmitHandler = async ({
    imo,
    vesselName,
    locode,
    portArea,
    berth,
    etaDate,
    etaTime,
    etdDate,
    etdTime,
  }: DockingFormValues) => {
    if (imo === '') {
      return;
    }

    setLoading(true);

    try {
      const dockingsResponse = await supabase
        .from('dockings')
        .insert({
          vessel_imo: imo,
          vessel_name: vesselName || null,
          locode: locode || null,
          port_area_code: portArea || null,
          berth_code: berth || null,
        })
        .select()
        .single();

      if (dockingsResponse.data) {
        dispatchDockings({ type: 'added', item: dockingsResponse.data });
      }

      if (dockingsResponse.error) {
        showNotification(getErrorNotification(dockingsResponse.status));
        return;
      }

      const queries = [];

      if (etaDate) {
        queries.push(
          supabase
            .from('docking_events')
            .insert({
              docking: dockingsResponse.data.id,
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
            .from('docking_events')
            .insert({
              docking: dockingsResponse.data.id,
              type: 'departure',
              estimated_date: dayjs(etaDate).format('YYYY-MM-DD'),
              estimated_time: etdTime || null,
            })
            .select()
            .single()
        );
      }

      const responses = await Promise.all(queries);
      responses.forEach((response) => {
        if (response.data) {
          dispatchDockingEvents({ type: 'added', item: response.data });
        }
      });

      for (const response of responses) {
        if (response.error) {
          showNotification(getErrorNotification(dockingsResponse.status));
          return;
        }
      }

      showNotification(getDockingSavedNotification());
      close();
    } catch {
      showNotification(getErrorNotification(500));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.onSubmit(newDockingSubmitHandler)}>
      <Stack>
        <DockingFormFields
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
