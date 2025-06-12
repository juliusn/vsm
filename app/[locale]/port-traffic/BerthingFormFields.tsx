'use client';

import { BerthingFormValues } from '@/lib/types/berthing';
import { Fieldset, Group, Stack, Text } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import {
  IconAnchor,
  IconArrowBarRight,
  IconArrowBarToRight,
  IconShip,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { LocationInputs } from './LocationInputs';
import { VesselInputs } from './VesselInputs';

interface BerthingFormFieldsProps {
  form: UseFormReturnType<
    BerthingFormValues,
    (values: BerthingFormValues) => BerthingFormValues
  >;
  vessel: AppTypes.Vessel | undefined;
  imoRef: React.RefObject<HTMLInputElement | null>;
  locode: string;
  portArea: string;
}

export function BerthingFormFields({
  form,
  vessel,
  imoRef,
  locode,
  portArea,
}: BerthingFormFieldsProps) {
  const t = useTranslations('NewBerthingForm');
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
          <VesselInputs form={form} vessel={vessel} imoRef={imoRef} />
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
          <LocationInputs form={form} locode={locode} portArea={portArea} />
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
    </>
  );
}
