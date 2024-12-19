'use client';

import { TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useTranslations } from 'next-intl';
import { FormValues } from './NewDockingForm';

export function ImoInput({
  form,
  imoRef,
}: {
  form: UseFormReturnType<FormValues>;
  imoRef: React.RefObject<HTMLInputElement>;
}) {
  const t = useTranslations('ImoInput');

  return (
    <TextInput
      required
      label={t('imo')}
      placeholder={t('enterImo')}
      ref={imoRef}
      {...form.getInputProps('imo')}
      onChange={(event) => {
        const value = event.currentTarget.value;
        if (value === '') {
          form.setFieldValue('vessel', '');
          form.setFieldValue('imo', '');
          return;
        }
        const numericValue = value.replace(/[^0-9]/g, '').slice(0, 7);
        if (numericValue) {
          form.setFieldValue('imo', numericValue);
        }
      }}
    />
  );
}
