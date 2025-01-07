'use client';

import { NumberInput, NumberInputProps } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function ImoInput({ ...props }: NumberInputProps) {
  const t = useTranslations('ImoInput');

  return (
    <NumberInput
      label={t('imo')}
      placeholder={t('enterImo')}
      hideControls
      maxLength={7}
      required
      {...props}
    />
  );
}
