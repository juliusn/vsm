'use client';

import { useApprovalStatus } from '@/app/hooks/approvalStatus';
import { Tables } from '@/lib/types/database.types';
import { Badge, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function ProfileContent({ profile }: { profile: Tables<'profiles'> }) {
  const t = useTranslations('ProfileContent');
  const { approvalStatusColors, approvalStatusLabels } = useApprovalStatus();
  const color = approvalStatusColors[profile.approval_status];
  const label = approvalStatusLabels[profile.approval_status];

  return (
    <Table>
      <Table.Tbody>
        <Table.Tr>
          <Table.Td>{t('firstName')}</Table.Td>
          <Table.Td>{profile.first_name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>{t('lastName')}</Table.Td>
          <Table.Td>{profile.last_name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Td>{t('approvalStatus')}</Table.Td>
          <Table.Td>
            <Badge radius="xs" color={color}>
              {label}
            </Badge>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
