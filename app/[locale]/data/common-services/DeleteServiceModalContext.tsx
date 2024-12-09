'use client';

import { Button, Group, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useState, useTransition } from 'react';

interface ModalProps {
  previewContent: React.ReactNode;
  onConfirm: () => Promise<void>;
}

interface ModalContextProps {
  openDeleteModal: (props: ModalProps) => void;
  closeDeleteModal: () => void;
}

const DeleteServiceModalContext = createContext<ModalContextProps | null>(null);

export function DeleteServiceModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('DeleteServiceModalProvider');
  const [opened, { open, close }] = useDisclosure(false);
  const [deleteIsPending, startDelete] = useTransition();
  const [modalProps, setModalProps] = useState<ModalProps | null>(null);

  const openModal = (props: ModalProps) => {
    setModalProps(props);
    open();
  };

  return (
    <DeleteServiceModalContext.Provider
      value={{
        openDeleteModal: openModal,
        closeDeleteModal: close,
      }}>
      {children}
      <Modal opened={opened} onClose={close} title={t('modalTitle')}>
        <Stack>
          {t('confirmationMessage')}
          {modalProps?.previewContent}
          <Group grow>
            <Button variant="outline" onClick={close}>
              {t('cancelButtonLabel')}
            </Button>
            <Button
              color="red"
              onClick={() => {
                if (modalProps === null) {
                  return;
                }
                startDelete(() => {
                  modalProps.onConfirm();
                });
              }}
              loading={deleteIsPending}>
              {t('deleteButtonLabel')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </DeleteServiceModalContext.Provider>
  );
}

export const useDeleteServiceModal = (): ModalContextProps => {
  const context = useContext(DeleteServiceModalContext);
  if (context === null)
    throw new Error(
      'useDeleteServiceModal must be used within a DeleteServiceModalContext.Provider.'
    );
  return context;
};
