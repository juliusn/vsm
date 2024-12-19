'use client';

import { Button, ComboboxItem, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { LocationInputsContextProvider } from './LocationInputContext';
import { NewDockingForm } from './NewDockingForm';

interface NewDockingContentProps {
  vesselItems: ComboboxItem[];
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
}

export function NewDockingContent({
  vesselItems,
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
        <LocationInputsContextProvider locations={locations}>
          <NewDockingForm
            vesselItems={vesselItems}
            locations={locations}
            portAreas={portAreas}
            berths={berths}
          />
        </LocationInputsContextProvider>
      </Modal>
    </>
  );
}
