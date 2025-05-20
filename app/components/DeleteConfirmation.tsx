'use client';

import { Button, Group, Paper, Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';

interface DeleteConfirmationProps {
  message: string;
  preview: React.ReactNode;
  cancel: () => void;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
  loading: boolean;
}

export function DeleteConfirmation({
  message,
  preview,
  cancel,
  onConfirm,
  loading,
}: DeleteConfirmationProps) {
  const t = useTranslations('DeleteConfirmation');

  return (
    <Stack>
      {message}
      <Paper withBorder shadow="sm">
        {preview}
      </Paper>
      <Group grow>
        <Button variant="outline" onClick={cancel}>
          {t('cancel')}
        </Button>
        <Button color="red" onClick={onConfirm} loading={loading}>
          {t('delete')}
        </Button>
      </Group>
    </Stack>
  );
}
