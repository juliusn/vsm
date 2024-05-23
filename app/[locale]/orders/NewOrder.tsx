'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { NewOrderForm } from './NewOrderForm';

export function NewOrder() {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('NewOrder');
  return (
    <>
      <Button
        onClick={open}
        m={0}
        leftSection={<IconPlus stroke={1.5} />}
        rightSection={<span className="w-6"></span>}
        justify="space-between"
        className="mt-2">
        {t('newOrder')}
      </Button>
      <Modal opened={opened} onClose={close} title={t('title')}>
        <NewOrderForm />
      </Modal>
    </>
  );
}
