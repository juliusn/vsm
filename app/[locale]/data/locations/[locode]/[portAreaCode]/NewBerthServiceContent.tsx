'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { NewBerthServiceForm } from './NewBerthServiceForm';

export function NewBerthServiceContent({
  locode,
  portAreaCode,
  berthCode,
}: {
  locode: string;
  portAreaCode: string;
  berthCode: string;
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('NewBerthServiceContent');

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus size={20} stroke={2} />}>
        {t('buttonLabel')}
      </Button>
      <Modal opened={opened} onClose={close} title={t('modalTitle')}>
        <NewBerthServiceForm
          locode={locode}
          portAreaCode={portAreaCode}
          berthCode={berthCode}
          close={close}
        />
      </Modal>
    </>
  );
}
