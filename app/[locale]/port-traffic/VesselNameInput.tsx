'use client';

import { ComboboxItem, Select } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useTranslations } from 'next-intl';
import { FormValues } from './NewDockingForm';

interface VesselNameInputProps {
  vesselItems: ComboboxItem[];
  vessel: string | null;
  setVessel: (value: React.SetStateAction<string | null>) => void;
  form: UseFormReturnType<FormValues>;
  imoRef: React.RefObject<HTMLInputElement>;
}

export function VesselNameInput({
  vesselItems,
  vessel,
  setVessel,
  form,
  imoRef,
}: VesselNameInputProps) {
  const t = useTranslations('VesselNameInput');
  const onChange = (value: typeof vessel) => {
    setVessel(value);
    if (value) {
      form.setFieldValue('imo', value);
      setTimeout(() => {
        imoRef.current?.select();
      }, 0);
    } else {
      form.setFieldValue('imo', '');
      form.getInputNode('vessel')?.focus();
    }
  };

  return (
    <Select
      label={t('vesselName')}
      placeholder={t('selectVessel')}
      data={vesselItems}
      limit={20}
      searchable
      clearable
      key={form.key('vessel')}
      {...form.getInputProps('vessel')}
      value={vessel}
      onChange={onChange}
    />
  );
}
