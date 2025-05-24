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
  DockingRowData,
  PortAreaIdentifier,
} from '@/lib/types/docking';
import { Mutation } from '@/lib/types/mutation';
import { Group, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import { useRef, useState } from 'react';
import { useDockings } from '../../context/DockingContext';
import { DockingFormFields } from './DockingFormFields';
import { useLocations } from '../../context/LocationContext';
import useDockingFormValidation from '../../hooks/useDockingFormValidation';

interface EditDockingContentProps {
  dockingRow: DockingRowData;
  close: () => void;
}

type DockingEventMutation = Mutation<AppTypes.DockingEvent>;
type DockingEventQuery = DockingEventMutation['query'];
type StateUpdateHandler = DockingEventMutation['stateUpdateHandler'];

export function EditDockingForm({
  dockingRow,
  close,
}: EditDockingContentProps) {
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const getDockingSavedNotification = useDockingSavedNotification();
  const { dispatchDockings, dispatchDockingEvents } = useDockings();
  const { vessels } = useLocations();
  const vesselMatch = vessels.find(
    (vessel) => vessel.imo === dockingRow.vessel_imo
  );
  const [loading, setLoading] = useState(false);
  const [vessel, setVessel] = useState<AppTypes.Vessel | undefined>(
    vesselMatch
  );
  const [locode, setLocode] = useState(dockingRow.locode || '');
  const portAreaIdentifier: PortAreaIdentifier | null =
    dockingRow.locode && dockingRow.port_area_code
      ? {
          locode: dockingRow.locode,
          port_area_code: dockingRow.port_area_code,
        }
      : null;
  const berthIdentifier: BerthIdentifier | null =
    dockingRow.locode && dockingRow.port_area_code && dockingRow.berth_code
      ? {
          locode: dockingRow.locode,
          port_area_code: dockingRow.port_area_code,
          berth_code: dockingRow.berth_code,
        }
      : null;
  const [portArea, setPortArea] = useState(
    portAreaIdentifier ? JSON.stringify(portAreaIdentifier) : ''
  );
  const validate = useDockingFormValidation();
  const imoRef = useRef<HTMLInputElement>(null);
  const initialValues: DockingFormValues = {
    vesselName: dockingRow.vessel_imo.toString(),
    imo: dockingRow.vessel_imo,
    locode: dockingRow.locode || '',
    portArea: portAreaIdentifier ? JSON.stringify(portAreaIdentifier) : '',
    berth: berthIdentifier ? JSON.stringify(berthIdentifier) : '',
    etaDate: dockingRow.arrival
      ? dayjs(dockingRow.arrival.estimated_date).toDate()
      : '',
    etaTime: dockingRow.arrival?.estimated_time || '',
    etdDate: dockingRow.departure
      ? dayjs(dockingRow.departure.estimated_date).toDate()
      : '',
    etdTime: dockingRow.departure?.estimated_time || '',
  };

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

  const updateDockingSubmitHandler = async ({
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

    const queries: DockingEventQuery[] = [];
    const stateUpdateHandlers: StateUpdateHandler[] = [];

    const prepareUpdate = (
      date: Date,
      time: string,
      id: string
    ): DockingEventMutation => ({
      query: supabase
        .from('docking_events')
        .update({
          estimated_date: dayjs(date).format('YYYY-MM-DD'),
          estimated_time: time || null,
        })
        .eq('id', id)
        .select()
        .single(),
      stateUpdateHandler: (data: AppTypes.DockingEvent) => {
        dispatchDockingEvents({ type: 'changed', item: data });
      },
    });

    const prepareRemove = (id: string): DockingEventMutation => ({
      query: supabase
        .from('docking_events')
        .delete()
        .eq('id', id)
        .select()
        .single(),
      stateUpdateHandler: () => {
        dispatchDockingEvents({ type: 'deleted', id });
      },
    });

    const prepareInsert = (
      docking: string,
      type: AppTypes.DockingEvent['type'],
      date: Date,
      time: string
    ): DockingEventMutation => ({
      query: supabase
        .from('docking_events')
        .insert({
          docking,
          type,
          estimated_date: dayjs(date).format('YYYY-MM-DD'),
          estimated_time: time || null,
        })
        .select()
        .single(),
      stateUpdateHandler: (data: AppTypes.DockingEvent) => {
        dispatchDockingEvents({ type: 'added', item: data });
      },
    });

    try {
      const dockingsResponse = await supabase
        .from('dockings')
        .update({
          vessel_imo: imo,
          vessel_name: vesselName || null,
          locode: locode || null,
          port_area_code: portArea || null,
          berth_code: berth || null,
        })
        .eq('id', dockingRow.id)
        .select()
        .single();

      if (dockingsResponse.data) {
        dispatchDockings({ type: 'changed', item: dockingsResponse.data });
      }

      if (dockingsResponse.error) {
        showNotification(getErrorNotification(dockingsResponse.status));
        return;
      }

      handleDockingEvent(
        dockingRow.arrival,
        etaDate,
        etaTime,
        dockingsResponse.data.id,
        'arrival'
      );

      handleDockingEvent(
        dockingRow.departure,
        etdDate,
        etdTime,
        dockingsResponse.data.id,
        'departure'
      );

      const responses = await Promise.all(queries);
      responses.forEach((response, index) => {
        if (response.data) {
          stateUpdateHandlers[index](response.data);
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

    function handleDockingEvent(
      dockingEvent: AppTypes.DockingEvent | null,
      date: Date | '',
      time: string,
      docking: string,
      type: AppTypes.DockingEvent['type']
    ) {
      if (dockingEvent) {
        if (date) {
          if (
            date.getTime() !==
              new Date(dockingEvent.estimated_date).getTime() ||
            time !== (dockingEvent.estimated_time || '')
          ) {
            const { query, stateUpdateHandler } = prepareUpdate(
              date,
              time,
              dockingEvent.id
            );
            queries.push(query);
            stateUpdateHandlers.push(stateUpdateHandler);
          }
        } else {
          const { query, stateUpdateHandler } = prepareRemove(dockingEvent.id);
          queries.push(query);
          stateUpdateHandlers.push(stateUpdateHandler);
        }
      } else {
        if (date) {
          const { query, stateUpdateHandler } = prepareInsert(
            docking,
            type,
            date,
            time
          );
          queries.push(query);
          stateUpdateHandlers.push(stateUpdateHandler);
        }
      }
    }
  };

  return (
    <form onSubmit={form.onSubmit(updateDockingSubmitHandler)}>
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
