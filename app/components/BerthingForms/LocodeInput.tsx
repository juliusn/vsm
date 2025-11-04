'use client';

import { Tables } from '@/lib/types/database.types';
import { ComboboxItem, Select, SelectProps } from '@mantine/core';
import { useTranslations } from 'next-intl';

interface LocodeInputProps extends SelectProps {
  locations: Tables<'locations'>[];
}

export function LocodeInput({ locations, ...others }: LocodeInputProps) {
  const t = useTranslations('LocodeInput');
  const locationsData = locations.map(
    ({ locode, location_name }): ComboboxItem => ({
      value: locode,
      label: location_name,
    })
  );

  return (
    <Select
      data={locationsData}
      label={t('location')}
      placeholder={t('selectLocation')}
      searchable
      clearable
      {...others}
    />
  );
}
