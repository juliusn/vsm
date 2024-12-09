'use client';

import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useState, useTransition } from 'react';

interface ModalProps {
  title: string;
  serviceTitles: AppTypes.ServiceTitles;
  onSave: (titles: AppTypes.ServiceTitles) => Promise<void>;
}

interface ModalContextProps {
  openEditModal: (props: ModalProps) => void;
  closeEditModal: () => void;
}

const EditServiceModalContext = createContext<ModalContextProps | null>(null);

export function EditServiceModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('EditServiceModalProvider');
  const [opened, { open, close }] = useDisclosure(false);
  const [updateIsPending, startUpdate] = useTransition();
  const [onSave, setOnSave] = useState<
    ((titles: AppTypes.ServiceTitles) => Promise<void>) | null
  >(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [titleEn, setTitleEn] = useState<string>('');
  const [titleFi, setTitleFi] = useState<string>('');

  const openModal = ({
    title,
    serviceTitles: { en, fi },
    onSave,
  }: ModalProps) => {
    setModalTitle(title);
    setOnSave(() => onSave);
    setTitleEn(en);
    setTitleFi(fi);
    open();
  };

  return (
    <EditServiceModalContext.Provider
      value={{
        openEditModal: openModal,
        closeEditModal: close,
      }}>
      {children}
      <Modal opened={opened} onClose={close} title={modalTitle}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (onSave === null) {
              return;
            }
            startUpdate(() => {
              onSave({ en: titleEn, fi: titleFi });
            });
          }}>
          <Stack>
            <TextInput
              required
              label={t('titleInputLabelEn')}
              value={titleEn}
              onChange={(event) => setTitleEn(event.currentTarget.value)}
            />
            <TextInput
              required
              label={t('titleInputLabelFi')}
              value={titleFi}
              onChange={(event) => setTitleFi(event.currentTarget.value)}
            />
            <Group grow>
              <Button variant="outline" onClick={close}>
                {t('cancelButtonLabel')}
              </Button>
              <Button type="submit" loading={updateIsPending}>
                {t('saveButtonLabel')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </EditServiceModalContext.Provider>
  );
}

export const useEditServiceModal = (): ModalContextProps => {
  const context = useContext(EditServiceModalContext);
  if (context === null)
    throw new Error(
      'useEditServiceModal must be used within a EditServiceModalContext.Provider.'
    );
  return context;
};
