'use client';

import { Table } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function ProfileContent({ profile }: { profile: Profile }) {
  const t = useTranslations('ProfilePage');

  const accountType = {
    personal: t('personal'),
    shared: t('shared'),
  };
  const approvalStatus = {
    pending: t('pending'),
    approved: t('approved'),
    rejected: t('rejected'),
  };
  const rows = [
    { key: t('userName'), value: profile.user_name },
    { key: t('accountType'), value: accountType[profile.account_type] },
    {
      key: t('approvalStatus'),
      value: approvalStatus[profile.approval_status],
    },
  ];
  return (
    <Table>
      <tbody>
        {rows.map((row) => (
          <tr key={row.key}>
            <td>{row.key}</td>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
