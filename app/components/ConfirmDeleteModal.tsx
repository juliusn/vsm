'use client';

import { Button, Group, Modal, Paper, Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';
interface ConfirmDeleteModalProps {
  opened: boolean;
  close: () => void;
  title: string;
  message: string;
  preview: React.ReactNode;
  onConfirm: MouseEventHandler<HTMLButtonElement>;
  loading: boolean;
}
export function ConfirmDeleteModal({
  opened,
  close,
  title,
  message,
  preview,
  onConfirm,
  loading,
}: ConfirmDeleteModalProps) {
  const t = useTranslations('ConfirmDeleteModal');

  return (
    <Modal size="auto" opened={opened} onClose={close} title={title}>
      <Stack>
        {message}
        <Paper withBorder shadow="sm">
          {preview}
        </Paper>
        <Group grow>
          <Button variant="outline" onClick={close}>
            {t('cancel')}
          </Button>
          <Button color="red" onClick={onConfirm} loading={loading}>
            {t('delete')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
