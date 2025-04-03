'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { NewDockingForm } from './NewDockingForm';

interface NewDockingContentProps {
  vessels: AppTypes.Vessel[];
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
}

export function NewDockingContent({
  vessels,
  locations,
  portAreas,
  berths,
}: NewDockingContentProps) {
  const t = useTranslations('NewDockingContent');
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button onClick={open} leftSection={<IconPlus size={20} stroke={2} />}>
        {t('buttonLabel')}
      </Button>
      <Modal opened={opened} onClose={close} title={t('modalTitle')}>
        <NewDockingForm
          vessels={vessels}
          locations={locations}
          portAreas={portAreas}
          berths={berths}
          close={close}
        />
      </Modal>
    </>
  );
}
