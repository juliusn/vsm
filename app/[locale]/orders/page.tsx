'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { NewOrderForm } from './NewOrderForm';

export default function OrdersPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('Orders');
  return (
    <>
      <Button onClick={open} leftSection={<IconPlus stroke={1.5} />}>
        {t('newOrder')}
      </Button>
      <Modal opened={opened} onClose={close} title={t('ordersTitle')}>
        <NewOrderForm />
      </Modal>
    </>
  );
}
