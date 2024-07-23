'use client';

import { Vessel } from '@/lib/types/vessels-api.types';
import { Checkbox, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function VesselsTable({ vessels }: { vessels: Vessel[] }) {
  const t = useTranslations('Data');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const vesselRows = vessels.map((vessel, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Checkbox
          aria-label={t('portsSelect')}
          checked={selectedRows.includes(index)}
          onChange={(event) =>
            setSelectedRows(
              event.currentTarget.checked
                ? [...selectedRows, index]
                : selectedRows.filter((position) => position !== index)
            )
          }
        />
      </Table.Td>
      <Table.Td>{vessel.mmsi}</Table.Td>
      <Table.Td>{vessel.name}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th />
          <Table.Th>{t('mmsi')}</Table.Th>
          <Table.Th>{t('name')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{vesselRows}</Table.Tbody>
    </Table>
  );
}
