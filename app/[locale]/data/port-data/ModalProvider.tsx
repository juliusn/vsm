'use client';

import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { createContext, useContext, useState } from 'react';

interface ModalContextProps {
  showModal: (title: string, content: React.ReactNode) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextProps | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const showModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    open();
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal: close }}>
      {children}
      <Modal opened={opened} onClose={close} title={modalTitle}>
        {modalContent}
      </Modal>
    </ModalContext.Provider>
  );
}

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (context === null)
    throw new Error('useModal must be used within a ModalProvider');
  return context;
};
