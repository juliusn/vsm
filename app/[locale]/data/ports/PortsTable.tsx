'use client';

import { PortAreaFeature } from '@/lib/types/ports-api.types';
import { Checkbox, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function PortsTable({ portAreas }: { portAreas: PortAreaFeature[] }) {
  const t = useTranslations('Data');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const portAreaRows = portAreas.map((portArea: PortAreaFeature, index) => (
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
      <Table.Td>{portArea.properties.locode}</Table.Td>
      <Table.Td>{portArea.properties.portAreaName}</Table.Td>
      <Table.Td>{portArea.portAreaCode}</Table.Td>
      <Table.Td>
        {portArea.geometry
          ? `${portArea.geometry.coordinates[1]}, ${portArea.geometry.coordinates[0]}`
          : 'N/A'}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Table captionSide="top">
      <Table.Caption>{t('portsCaption')}</Table.Caption>
      <Table.Thead>
        <Table.Tr>
          <Table.Th />
          <Table.Th>{t('locode')}</Table.Th>
          <Table.Th>{t('portAreaName')}</Table.Th>
          <Table.Th>{t('portAreaCode')}</Table.Th>
          <Table.Th>{t('coordinates')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{portAreaRows}</Table.Tbody>
    </Table>
  );
}
