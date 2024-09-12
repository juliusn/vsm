'use client';

import { ActionIcon, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import AddLocodeForm from './AddLocodeForm';

export default function AddLocodeContent({
  existingLocodes,
  addedLocodes,
}: {
  existingLocodes: string[];
  addedLocodes: string[];
}) {
  const t = useTranslations('AddLocodeContent');
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ActionIcon onClick={open}>
        <IconPlus stroke={1.5} />
      </ActionIcon>
      <Modal opened={opened} onClose={close} title={t('title')}>
        <AddLocodeForm
          existingLocodes={existingLocodes}
          addedLocodes={addedLocodes}
          closeModal={close}
        />
      </Modal>
    </>
  );
}
