'use client';

import { Fieldset, Group, Stack, Text } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import {
  IconAnchor,
  IconArrowBarRight,
  IconArrowBarToRight,
  IconShip,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { ComponentProps } from 'react';
import { LocationInputs } from '../[locale]/port-traffic/LocationInputs';
import { VesselInputs } from '../[locale]/port-traffic/VesselInputs';

interface Props {
  vesselInputsProps: ComponentProps<typeof VesselInputs>;
  locationInputsProps: ComponentProps<typeof LocationInputs>;
  etaDateProps: GetInputPropsReturnType;
  etaDateKey: string;
  etaTimeProps: GetInputPropsReturnType;
  etaTimeKey: string;
  etdDateProps: GetInputPropsReturnType;
  etdDateKey: string;
  etdTimeProps: GetInputPropsReturnType;
  etdTimeKey: string;
}

export function BerthingFormFields({
  vesselInputsProps,
  locationInputsProps,
  etaDateProps,
  etaDateKey,
  etaTimeProps,
  etaTimeKey,
  etdDateProps,
  etdDateKey,
  etdTimeProps,
  etdTimeKey,
}: Props) {
  const t = useTranslations('BerthingFormFields');

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
          <VesselInputs {...vesselInputsProps} />
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
          <LocationInputs {...locationInputsProps} />
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
            {...etaDateProps}
            key={etaDateKey}
          />
          <TimeInput label={t('time')} {...etaTimeProps} key={etaTimeKey} />
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
            {...etdDateProps}
            key={etdDateKey}
          />
          <TimeInput label={t('time')} {...etdTimeProps} key={etdTimeKey} />
        </Stack>
      </Fieldset>
    </>
  );
}
