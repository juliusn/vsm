'use client';

import { Vessel } from '@/lib/types/vessels-api.types';
import { Group, NumberInput, Text, TextInput } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

export default function VesselsList({ vessels }: { vessels: Vessel[] }) {
  const t = useTranslations('Data');
  const [mmsiSearch, setMmsiSearch] = useState<string | number>('');
  const [nameSearch, setNameSearch] = useState<string>('');
  const filteredItems = vessels.filter(
    (vessel) =>
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
        style={{ height: 400 }}
        data={filteredItems}
        totalCount={vessels.length}
        itemContent={(index, vessel) => {
          return <Text key={index}>{`${vessel.mmsi} ${vessel.name}`}</Text>;
        }}
      />
    </>
  );
}
