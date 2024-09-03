'use client';

import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
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
      <Button onClick={open}>{t('title')}</Button>
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
