'use client';

import { NumberInput, NumberInputProps } from '@mantine/core';
import { useTranslations } from 'next-intl';
interface ImoInputProps extends NumberInputProps {
  ref?: React.Ref<HTMLInputElement>;
}

export function ImoInput({ ref, ...props }: ImoInputProps) {
  const t = useTranslations('ImoInput');

  return (
    <NumberInput
      label={t('imo')}
      placeholder={t('enterImo')}
      hideControls
      maxLength={7}
      required
      {...props}
      ref={ref}
    />
  );
}
