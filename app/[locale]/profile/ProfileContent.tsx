'use client';

import { Badge, DefaultMantineColor, Table } from '@mantine/core';
import { useTranslations } from 'next-intl';

type ApprovalStatusAttributes = {
  label: string;
  color: DefaultMantineColor;
};

type ApprovalStatus = Database['public']['Enums']['approval_status_enum'];

export function ProfileContent({ profile }: { profile: AppTypes.Profile }) {
  const t = useTranslations('ProfileContent');
  const approvalStatusMap: Record<ApprovalStatus, ApprovalStatusAttributes> = {
    pending: { label: t('pending'), color: 'yellow' },
    approved: { label: t('approved'), color: 'green' },
    rejected: { label: t('rejected'), color: 'red' },
  };
  const approvalStatus = approvalStatusMap[profile.approval_status];

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
            <Badge radius="xs" color={approvalStatus.color}>
              {approvalStatus.label}
            </Badge>
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
