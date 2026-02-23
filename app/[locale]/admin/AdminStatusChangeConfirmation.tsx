'use client';

import { Button, Group, Paper, Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';

interface Props {
  admin: boolean;
  preview: React.ReactNode;
  cancel(): void;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
  loading: boolean;
}

export function AdminStatusChangeConfirmation({
  admin,
  preview,
  cancel,
  onConfirm,
  loading,
}: Props) {
  const t = useTranslations('AdminStatusChangeConfirmation');

  return (
    <Stack>
      {admin ? t('grantAdminConfirmation') : t('revokeAdminConfirmation')}
      <Paper withBorder shadow="sm">
        {preview}
      </Paper>
      <Group grow>
        <Button variant="outline" onClick={cancel}>
          {t('cancel')}
        </Button>
        <Button variant="filled" onClick={onConfirm} loading={loading}>
          {admin ? t('grant') : t('revoke')}
        </Button>
      </Group>
    </Stack>
  );
}
