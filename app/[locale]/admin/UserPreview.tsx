'use client';

import { Tables } from '@/lib/types/database.types';
import { Table } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function UserPreview({
  profile,
}: {
  profile: Tables<'profiles'>;
}) {
  const t = useTranslations('UserTable');

  return (
    <Table
      captionSide="top"
      variant="vertical"
      styles={{ th: { backgroundColor: 'transparent' } }}>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>{t('id')}</Table.Th>
          <Table.Td>{profile.id}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('firstName')}</Table.Th>
          <Table.Td>{profile.first_name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('lastName')}</Table.Th>
          <Table.Td>{profile.last_name}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
