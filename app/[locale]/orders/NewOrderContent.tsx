'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export function NewOrderContent({ children }: { children: React.ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('Orders');
  return (
    <>
      <Button onClick={open} leftSection={<IconPlus stroke={1.5} />}>
        {t('newOrder')}
      </Button>
      <Modal opened={opened} onClose={close} title={t('newOrderTitle')}>
        {children}
      </Modal>
    </>
  );
}
