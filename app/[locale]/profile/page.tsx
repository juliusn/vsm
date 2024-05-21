'use client';

import { useProfileStore } from '@/app/store';
import { Container, Stack, Table, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  const profile = useProfileStore((state) => state.profile);

  return (
    <Container size="24rem">
      {profile && <ProfileContent profile={profile} />}
    </Container>
  );
}

function ProfileContent({ profile }: { profile: Profile }) {
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
    <Stack>
      <Title size="h4">{t('title')}</Title>
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
    </Stack>
  );
}
