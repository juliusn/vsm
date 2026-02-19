'use client';

import { NumberInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { ComponentPropsWithRef } from 'react';

export function ImoInput({
  ...props
}: ComponentPropsWithRef<typeof NumberInput>) {
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
