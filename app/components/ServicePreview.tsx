'use client';

import { Paper, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function ServicePreview({ titles }: { titles: AppTypes.ServiceTitles }) {
  const t = useTranslations('ServicePreview');
  return (
    <Paper withBorder shadow="sm">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('titleEn')}</Table.Th>
            <Table.Th>{t('titleFi')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>{titles['en']}</Table.Td>
            <Table.Td>{titles['fi']}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
