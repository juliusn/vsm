'use client';

import { Table } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function ProfileContent({ profile }: { profile: AppTypes.Profile }) {
  const t = useTranslations('ProfilePage');
  const approvalStatus = {
    pending: t('pending'),
    approved: t('approved'),
    rejected: t('rejected'),
  };
  const rows = [
    { key: t('firstName'), value: profile.first_name },
    { key: t('lastName'), value: profile.last_name },
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
            <td className="pl-12">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
