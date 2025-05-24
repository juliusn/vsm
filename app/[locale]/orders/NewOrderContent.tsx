'use client';

import { Button, Group, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { NewOrderForm } from './NewOrderForm';

export function NewOrderContent() {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('NewOrderContent');

  return (
    <>
      <Modal size="lg" opened={opened} onClose={close} title={t('modalTitle')}>
        <NewOrderForm close={close} />
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
