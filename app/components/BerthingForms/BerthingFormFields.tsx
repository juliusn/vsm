'use client';

import { LocationInputs } from '@/app/components/BerthingForms/LocationInputs';
import { VesselInputs } from '@/app/components/BerthingForms/VesselInputs';
import { useBerthingFormContext } from '@/app/context/BerthingFormContext';
import { useBerthingInputData } from '@/app/context/BerthingInputDataContext';
import { BerthIdentifier, PortAreaIdentifier } from '@/lib/types/berthing';
import { Fieldset, Group, Space, Stack, Text } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import {
  IconArrowBarRight,
  IconArrowBarToRight,
  IconShip,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function BerthingFormFields() {
  const t = useTranslations('BerthingFormFields');
  const form = useBerthingFormContext();

  const {
    arrivalLocode,
    setArrivalLocode,
    arrivalPortArea,
    setArrivalPortArea,
    departureLocode,
    setDepartureLocode,
    departurePortArea,
    setDeparturePortArea,
  } = useBerthingInputData();

  form.watch('arrivalDate', ({ value }) => {
    if (value === null) {
      form.setFieldValue('arrivalTime', null);
      form.setFieldValue('arrivalLocode', null);
      form.setFieldValue('arrivalPortArea', null);
      form.setFieldValue('arrivalBerth', null);
      form.setFieldValue('arrivalPosition', null);
      return;
    }
    form.validateField('arrivalTime');
    form.validateField('departureDate');
  });

  form.watch('arrivalTime', () => {
    form.validateField('departureTime');
  });

  form.watch('arrivalLocode', ({ previousValue, value }) => {
    setArrivalLocode(value);
    if (previousValue !== null && previousValue !== value) {
      form.setFieldValue('arrivalPortArea', null);
    }
  });

  form.watch('arrivalPortArea', ({ previousValue, value }) => {
    setArrivalPortArea(value);
    if (previousValue !== null && previousValue !== value) {
      form.setFieldValue('arrivalBerth', null);
    }
    if (value) {
      const { locode }: PortAreaIdentifier = JSON.parse(value);
      form.setFieldValue('arrivalLocode', locode);
    }
  });

  form.watch('arrivalBerth', ({ value }) => {
    if (value) {
      const { locode, port_area_code }: BerthIdentifier = JSON.parse(value);
      form.setFieldValue('arrivalLocode', locode);
      const portArea: PortAreaIdentifier = { locode, port_area_code };
      form.setFieldValue('arrivalPortArea', JSON.stringify(portArea));
    }
  });

  form.watch('departureDate', ({ value }) => {
    if (value === null) {
      form.setFieldValue('departureTime', null);
      form.setFieldValue('departureLocode', null);
      form.setFieldValue('departurePortArea', null);
      form.setFieldValue('departureBerth', null);
      return;
    }
    form.validateField('departureTime');
    form.validateField('arrivalDate');
  });

  form.watch('departureTime', () => {
    form.validateField('arrivalTime');
  });

  form.watch('departureLocode', ({ previousValue, value }) => {
    setDepartureLocode(value);
    if (previousValue !== null && previousValue !== value) {
      form.setFieldValue('departurePortArea', null);
      form.setFieldValue('departureBerth', null);
    }
  });

  form.watch('departurePortArea', ({ previousValue, value }) => {
    setDeparturePortArea(value);
    if (previousValue !== null && previousValue !== value) {
      form.setFieldValue('departureBerth', null);
    }
    if (value) {
      const { locode }: PortAreaIdentifier = JSON.parse(value);
      form.setFieldValue('departureLocode', locode);
    }
  });

  form.watch('departureBerth', ({ value }) => {
    if (value) {
      const { locode, port_area_code }: BerthIdentifier = JSON.parse(value);
      form.setFieldValue('departureLocode', locode);
      const portArea: PortAreaIdentifier = { locode, port_area_code };
      form.setFieldValue('departurePortArea', JSON.stringify(portArea));
    }
  });

  return (
    <>
      <Fieldset
        legend={
          <Group>
            <IconShip size={20} color="var(--mantine-color-blue-5)" />
            <Text>{t('vessel')}</Text>
          </Group>
        }>
        <Stack>
          <VesselInputs />
        </Stack>
      </Fieldset>

      <Space h="lg" />

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
            {...form.getInputProps('arrivalDate')}
            key={form.key('arrivalDate')}
          />
          <TimeInput
            label={t('time')}
            {...form.getInputProps('arrivalTime')}
            key={form.key('arrivalTime')}
          />
          <LocationInputs
            locode={arrivalLocode}
            portArea={arrivalPortArea}
            locodeInputKey={form.key('arrivalLocode')}
            locodeInputProps={form.getInputProps('arrivalLocode')}
            portAreaInputKey={form.key('arrivalPortArea')}
            portAreaInputProps={form.getInputProps('arrivalPortArea')}
            berthInputKey={form.key('arrivalBerth')}
            berthInputProps={form.getInputProps('arrivalBerth')}
          />
        </Stack>
      </Fieldset>

      <Space h="lg" />

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
            {...form.getInputProps('departureDate')}
            key={form.key('departureDate')}
          />
          <TimeInput
            label={t('time')}
            {...form.getInputProps('departureTime')}
            key={form.key('departureTime')}
          />
          <LocationInputs
            locode={departureLocode}
            portArea={departurePortArea}
            locodeInputKey={form.key('departureLocode')}
            locodeInputProps={form.getInputProps('departureLocode')}
            portAreaInputKey={form.key('departurePortArea')}
            portAreaInputProps={form.getInputProps('departurePortArea')}
            berthInputKey={form.key('departureBerth')}
            berthInputProps={form.getInputProps('departureBerth')}
          />
        </Stack>
      </Fieldset>
    </>
  );
}
