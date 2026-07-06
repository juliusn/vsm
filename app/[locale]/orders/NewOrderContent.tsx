'use client';

import { Button, Group, Modal, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { NewOrder } from './NewOrder';
import { useOrders } from '@/app/context/OrderContext';

export function NewOrderContent() {
  const [opened, { open, close }] = useDisclosure(false);
  const { orderPermissions } = useOrders();
  const t = useTranslations('NewOrderContent');

  const canCreate = orderPermissions
    .map((permission) => permission.order_permission)
    .includes('create');

  return (
    <>
      {canCreate && (
        <Modal
          size="lg"
          opened={opened}
          onClose={close}
          title={t('modalTitle')}>
          <NewOrder onCancel={close} onSaved={close} />
        </Modal>
      )}
      <Group justify="space-between">
        <Title size="h4">{t('title')}</Title>
        <Button
          onClick={open}
          leftSection={<IconPlus size={20} stroke={2} />}
          disabled={!canCreate}>
          {t('buttonLabel')}
        </Button>
      </Group>
    </>
  );
}
