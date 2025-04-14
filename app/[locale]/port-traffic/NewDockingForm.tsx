'use client';

import {
  useDockingSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { useDockingsStore } from '@/app/store';
import { createClient } from '@/lib/supabase/client';
import { Button, Fieldset, Group, Stack, Text } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { FormValidateInput, isNotEmpty, useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconAnchor,
  IconArrowBarRight,
  IconArrowBarToRight,
  IconShip,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useRef, useState, useTransition } from 'react';
import { LocationInputs } from './LocationInputs';
import { VesselInputs } from './VesselInputs';

export interface FormValues {
  vesselName: string;
  imo: number | '';
  locode: string;
  portArea: string;
  berth: string;
  etaDate: Date | '';
  etaTime: string;
  etdDate: Date | '';
  etdTime: string;
}

const initialValues: FormValues = {
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
  vessels: AppTypes.Vessel[];
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
  close: () => void;
}

export type PortAreaIdentifier = {
  locode: string;
  port_area_code: string;
};

export type BerthIdentifier = {
  locode: string;
  port_area_code: string;
  berth_code: string;
};

export function NewDockingForm({
  vessels,
  locations,
  portAreas,
  berths,
  close,
}: NewDockingContentProps) {
  const t = useTranslations('NewDockingForm');
  const supabase = createClient();
  const [updateIsPending] = useTransition();
  const getErrorNotification = usePostgresErrorNotification();
  const getDockingSavedNotification = useDockingSavedNotification();
  const { insertDocking, insertDockingEvent } = useDockingsStore();
  const [vessel, setVessel] = useState<AppTypes.Vessel | undefined>();
  const [locode, setLocode] = useState(initialValues.locode);
  const [portArea, setPortArea] = useState(initialValues.portArea);
  const validate = useValidate();
  const imoRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
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
  }: FormValues) => {
    if (imo === '') {
      return;
    }

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
      insertDocking(dockingsResponse.data);
    }

    if (dockingsResponse.error) {
      showNotification(getErrorNotification(dockingsResponse.status));
      return;
    }

    const dockingEventsQueries = [];

    if (etaDate) {
      dockingEventsQueries.push(
        supabase
          .from('docking_events')
          .insert({
            docking: dockingsResponse.data.id,
            type: 'arrival',
            estimated_date: etaDate.toISOString(),
            estimated_time: etaTime || null,
          })
          .select()
          .single()
      );
    }

    if (etdDate) {
      dockingEventsQueries.push(
        supabase
          .from('docking_events')
          .insert({
            docking: dockingsResponse.data.id,
            type: 'departure',
            estimated_date: etdDate.toISOString(),
            estimated_time: etdTime || null,
          })
          .select()
          .single()
      );
    }

    const responses = await Promise.all(dockingEventsQueries);
    responses.forEach((response) => {
      if (response.data) {
        insertDockingEvent(response.data);
      }
    });

    responses.forEach((response) => {
      if (response.error) {
        showNotification(getErrorNotification(dockingsResponse.status));
        return;
      }
    });

    showNotification(getDockingSavedNotification());
    close();
  };

  return (
    <form onSubmit={form.onSubmit(newDockingSubmitHandler)}>
      <Stack>
        <Fieldset
          legend={
            <Group>
              <IconShip size={20} color="var(--mantine-color-blue-5)" />
              <Text>{t('vessel')}</Text>
            </Group>
          }>
          <Stack>
            <VesselInputs
              form={form}
              vessel={vessel}
              vessels={vessels}
              imoRef={imoRef}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          legend={
            <Group>
              <IconAnchor size={20} color="var(--mantine-color-blue-5)" />
              <Text>{t('berth')}</Text>
            </Group>
          }>
          <Stack>
            <LocationInputs
              form={form}
              locode={locode}
              portArea={portArea}
              locations={locations}
              portAreas={portAreas}
              berths={berths}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          legend={
            <Group>
              <IconArrowBarToRight
                size={20}
                color="var(--mantine-color-green-5)"
              />
              <Text>{t('arrival')}</Text>
            </Group>
          }>
          <Stack>
            <DateInput
              valueFormat="DD.M.YYYY"
              highlightToday={true}
              label={t('date')}
              placeholder={t('selectDate')}
              clearable
              key={form.key('etaDate')}
              {...form.getInputProps('etaDate')}
            />
            <TimeInput
              label={t('time')}
              key={form.key('etaTime')}
              {...form.getInputProps('etaTime')}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          legend={
            <Group>
              <IconArrowBarRight size={20} color="var(--mantine-color-red-5)" />
              <Text>{t('departure')}</Text>
            </Group>
          }>
          <Stack>
            <DateInput
              valueFormat="DD.M.YYYY"
              highlightToday={true}
              label={t('date')}
              placeholder={t('selectDate')}
              clearable
              key={form.key('etdDate')}
              {...form.getInputProps('etdDate')}
            />
            <TimeInput
              label={t('time')}
              key={form.key('etdTime')}
              {...form.getInputProps('etdTime')}
            />
          </Stack>
        </Fieldset>
        <Group grow>
          <Button variant="outline" onClick={close}>
            {t('cancelButtonLabel')}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              setVessel(undefined);
            }}>
            {t('clearButtonLabel')}
          </Button>
          <Button
            type="submit"
            disabled={!form.isValid()}
            loading={updateIsPending}>
            {t('saveButtonLabel')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

function useValidate(): FormValidateInput<FormValues> {
  const t = useTranslations('NewDockingForm');
  const isSevenDigits = (errorMessage: string) => (value: number | '') =>
    value.toString().length !== 7 ? errorMessage : null;

  return {
    imo: (value: number | '') =>
      isNotEmpty(t('imoRequiredError'))(value) ??
      isSevenDigits(t('imoLengthError'))(value),
    etaDate: (value: Date | '', values: FormValues) => {
      if (values.etaTime && !value) {
        return t('timeWithoutDateError');
      }
      if (
        value &&
        values.etdDate &&
        dayjs(value).isAfter(dayjs(values.etdDate))
      ) {
        return t('etaAfterEtdError');
      }
      return null;
    },
    etaTime: (value, values) => {
      if (value && !values.etaDate) {
        return t('timeWithoutDateError');
      }
      const etdDateTime = dayjs(
        `${dayjs(values.etdDate).format('YYYY-MM-DD')}T${values.etdTime}`,
        'YYYY-MM-DDTHH:mm',
        true
      );
      const etaDateTime = dayjs(
        `${dayjs(values.etaDate).format('YYYY-MM-DD')}T${value}`,
        'YYYY-MM-DDTHH:mm',
        true
      );
      if (
        value &&
        values.etdDate &&
        values.etdTime &&
        etdDateTime.isBefore(etaDateTime)
      ) {
        return t('etaAfterEtdError');
      }
      return null;
    },
    etdDate: (value, values) => {
      if (values.etdTime && !value) {
        return t('timeWithoutDateError');
      }
      if (
        value &&
        values.etaDate &&
        dayjs(value).isBefore(dayjs(values.etaDate))
      ) {
        return t('etdBeforeEtaError');
      }
      return null;
    },
    etdTime: (value, values) => {
      if (value && !values.etdDate) {
        return t('timeWithoutDateError');
      }
      const etdDateTime = dayjs(
        `${dayjs(values.etdDate).format('YYYY-MM-DD')}T${value}`,
        'YYYY-MM-DDTHH:mm',
        true
      );
      const etaDateTime = dayjs(
        `${dayjs(values.etaDate).format('YYYY-MM-DD')}T${values.etaTime}`,
        'YYYY-MM-DDTHH:mm',
        true
      );
      if (
        value &&
        values.etaDate &&
        values.etaTime &&
        etdDateTime.isBefore(etaDateTime)
      ) {
        return t('etdBeforeEtaError');
      }
      return null;
    },
  };
}
