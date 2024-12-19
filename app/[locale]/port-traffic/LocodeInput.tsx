'use client';

import { ComboboxItem, Select } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useLocationInputs } from './LocationInputContext';

interface LocodeInputProps {
  locations: AppTypes.Location[];
}

export function LocodeInput({ locations }: LocodeInputProps) {
  const { locode, setLocode, setPortArea, setBerth } = useLocationInputs();
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
      value={locode}
      onChange={(value) => {
        setLocode(value);
        if (!value) {
          setPortArea(null);
          setBerth(null);
        }
      }}
    />
  );
}
