'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { NewOrderForm } from './NewOrderForm';

export function NewOrderContent({
  locations,
  portAreas,
  berths,
}: {
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
}) {
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('NewOrderContent');
  return (
    <>
      <Button onClick={open} leftSection={<IconPlus size={20} stroke={2} />}>
        {t('buttonLabel')}
      </Button>
      <Modal opened={opened} onClose={close} title={t('modalTitle')}>
        <NewOrderForm
          locations={locations}
          portAreas={portAreas}
          berths={berths}
        />
      </Modal>
    </>
  );
}
