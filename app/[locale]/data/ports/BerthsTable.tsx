'use client';

import { Berth } from '@/lib/types/ports-api.types';
import { Checkbox, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function BerthsTable({ berths }: { berths: Berth[] }) {
  const t = useTranslations('Data');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const berthRows = berths.map((berth, index) => (
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
      <Table.Td>{berth.locode}</Table.Td>
      <Table.Td>{berth.portAreaCode}</Table.Td>
      <Table.Td>{berth.berthCode}</Table.Td>
      <Table.Td>{berth.berthName}</Table.Td>
    </Table.Tr>
  ));
  return (
    <Table captionSide="top">
      <Table.Caption>{t('berthsCaption')}</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th />
          <Table.Th>{t('locode')}</Table.Th>
          <Table.Th>{t('portAreaCode')}</Table.Th>
          <Table.Th>{t('berthCode')}</Table.Th>
          <Table.Th>{t('berthName')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{berthRows}</Table.Tbody>
    </Table>
  );
}
