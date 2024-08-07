'use client';

import { Vessel } from '@/lib/types/vessels-api.types';
import { Checkbox, Group, NumberInput, TextInput } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function VesselsList({ vessels }: { vessels: Vessel[] }) {
  const t = useTranslations('Data');
  const [mmsiSearch, setMmsiSearch] = useState<string | number>('');
  const [nameSearch, setNameSearch] = useState<string>('');
  const initialValues = vessels.map((vessel) => ({ checked: false, vessel }));
  const [values, handlers] = useListState(initialValues);
  const filteredValues = values
    .map((value, originalIndex) => ({ ...value, originalIndex }))
    .filter(
      ({ vessel }) =>
        new RegExp(mmsiSearch.toString(), 'i').test(vessel.mmsi.toString()) &&
        new RegExp(nameSearch, 'i').test(vessel.name)
    );
  return (
    <>
      <Group align="end">
        <NumberInput
          name="mmsi"
          description={t('searchByMmsi')}
          placeholder={t('mmsi')}
          allowDecimal={false}
          allowNegative={false}
          onChange={setMmsiSearch}
        />
        <TextInput
          description={t('searchByName')}
          placeholder={t('name')}
          onChange={(event) => setNameSearch(event.currentTarget.value)}
        />
      </Group>
      <Virtuoso
        style={{ height: '100%' }}
        data={filteredValues}
        totalCount={initialValues.length}
        itemContent={(index, { checked, vessel, originalIndex }) => {
          return (
            <Checkbox
              mt="xs"
              key={index}
              checked={checked}
              label={`${vessel.mmsi} ${vessel.name}`}
              onChange={(event) =>
                handlers.setItemProp(
                  originalIndex,
                  'checked',
                  event.currentTarget.checked
                )
              }
            />
          );
        }}
      />
    </>
  );
}
