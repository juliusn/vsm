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
import { LocationInputs } from '@/app/components/BerthingForms/LocationInputs';
import { VesselInputs } from '@/app/components/BerthingForms/VesselInputs';

interface Props<T extends BerthingFormValues> {
  useFormContext(): UseFormReturnType<T>;
  vessel: AppTypes.Vessel | undefined;
  imoRef: React.RefObject<HTMLInputElement | null>;
  locode: string;
  portArea: string;
}

export function BerthingFormFields<T extends BerthingFormValues>({
  useFormContext,
  vessel,
  imoRef,
  locode,
  portArea,
}: Props<T>) {
  const t = useTranslations('BerthingFormFields');
  const form = useFormContext();

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
          <VesselInputs<T>
            useFormContext={useFormContext}
            vessel={vessel}
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
          <LocationInputs<T>
            useFormContext={useFormContext}
            locode={locode}
            portArea={portArea}
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
            {...form.getInputProps('etaDate')}
            key={form.key('etaDate')}
          />
          <TimeInput
            label={t('time')}
            {...form.getInputProps('etaTime')}
            key={form.key('etaTime')}
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
            {...form.getInputProps('etdDate')}
            key={form.key('etdDate')}
          />
          <TimeInput
            label={t('time')}
            {...form.getInputProps('etdTime')}
            key={form.key('etdTime')}
          />
        </Stack>
      </Fieldset>
    </>
  );
}
