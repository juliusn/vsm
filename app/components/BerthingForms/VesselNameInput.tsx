'use client';

import { Select, SelectProps } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function VesselNameInput({ ...props }: SelectProps) {
  const t = useTranslations('VesselNameInput');

  return (
    <Select
      label={t('vesselName')}
      placeholder={t('selectVessel')}
      limit={100}
      searchable
      clearable
      {...props}
    />
  );
}
