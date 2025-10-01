'use client';

import { Paper, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';

type Translation = { locale: string; title: string; abbreviation: string };

export function ServicePreview({
  translationEn,
  translationFi,
}: {
  translationEn: Translation;
  translationFi: Translation;
}) {
  const t = useTranslations('ServicePreview');
  return (
    <Paper withBorder shadow="sm">
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('titleEn')}</Table.Th>
            <Table.Th>{t('abbrvEn')}</Table.Th>
            <Table.Th>{t('titleFi')}</Table.Th>
            <Table.Th>{t('abbrvFi')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>{translationEn.title}</Table.Td>
            <Table.Td>{translationEn.abbreviation}</Table.Td>
            <Table.Td>{translationFi.title}</Table.Td>
            <Table.Td>{translationFi.abbreviation}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Paper>
  );
}
