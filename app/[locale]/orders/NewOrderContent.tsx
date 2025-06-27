'use client';

import { Button, Group, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { NewOrder } from './NewOrder';

export function NewOrderContent() {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('NewOrderContent');

  return (
    <>
      <Modal size="lg" opened={opened} onClose={close} title={t('modalTitle')}>
        <NewOrder onCancel={close} resultCallback={close} />
      </Modal>
      <Group justify="space-between">
        <Title size="h4">{t('title')}</Title>
        <Button onClick={open} leftSection={<IconPlus size={20} stroke={2} />}>
          {t('buttonLabel')}
        </Button>
      </Group>
    </>
  );
}
