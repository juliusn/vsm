'use client';

import { useBerthingFormContext } from '@/app/context/BerthingFormContext';
import { usePortEventFields } from '@/app/hooks/usePortEventFields';
import { Button, Stack } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { useTranslations } from 'next-intl';
import { LocationInputs } from './LocationInputs';

type PortEventPath = 'arrival' | 'departure' | `shiftings.${number}`;

type Props = {
  path: PortEventPath;
  removeClickHandler(): void;
  removeButtonLabel: string;
};

export default function PortEventFields({
  path,
  removeClickHandler,
  removeButtonLabel,
}: Props) {
  const t = useTranslations('BerthingFormFields');
  const form = useBerthingFormContext();
  const { locode, portAreaCode, paths } = usePortEventFields(path);

  return (
    <Stack>
      <DateInput
        valueFormat="DD.M.YYYY"
        highlightToday={true}
        label={t('date')}
        placeholder={t('selectDate')}
        {...form.getInputProps(paths.date)}
        key={form.key(paths.date)}
      />
      <TimeInput
        label={t('time')}
        {...form.getInputProps(paths.time)}
        key={form.key(paths.time)}
      />
      <LocationInputs
        locode={locode}
        portArea={portAreaCode}
        locodeInputKey={form.key(paths.locode)}
        locodeInputProps={form.getInputProps(paths.locode)}
        portAreaInputKey={form.key(paths.portArea)}
        portAreaInputProps={form.getInputProps(paths.portArea)}
        berthInputKey={form.key(paths.berth)}
        berthInputProps={form.getInputProps(paths.berth)}
      />
      <Button onClick={removeClickHandler} variant="transparent">
        {removeButtonLabel}
      </Button>
    </Stack>
  );
}
