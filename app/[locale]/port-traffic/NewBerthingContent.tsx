'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { NewBerthingForm } from '@/app/components/BerthingForms/NewBerthingForm';

export function NewBerthingContent() {
  const t = useTranslations('NewBerthingContent');
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus size={20} stroke={2} />}>
        {t('buttonLabel')}
      </Button>
      <Modal opened={opened} onClose={close} title={t('modalTitle')}>
        <NewBerthingForm close={close} resultCallback={close} />
      </Modal>
    </>
  );
}
