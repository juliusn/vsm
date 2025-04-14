'use client';

import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { Button, Group, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useState, useTransition } from 'react';
import { ActionTypes, useLocation } from '../../LocationContext';

interface DeleteServiceModalContextProps {
  showDeleteModal: (id: string, content: React.ReactNode) => void;
}

const DeleteServiceModalContext =
  createContext<DeleteServiceModalContextProps | null>(null);

export function DeleteServiceModalProvider({
  children,
  berthCode,
}: {
  children: React.ReactNode;
  berthCode: string;
}) {
  const t = useTranslations('DeleteServiceModalProvider');
  const getErrorNotification = usePostgresErrorNotification();
  const { dispatch } = useLocation();
  const [id, setId] = useState<string>('');
  const [deleteIsPending, startDelete] = useTransition();
  const supabase = createClient();
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const handleSubmit = () => {
    startDelete(async () => {
      const { error, status } = await supabase
        .from('berth_services')
        .delete()
        .eq('id', id);

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      dispatch({
        type: ActionTypes.REMOVE_SERVICE,
        payload: {
          id,
        },
      });

      showNotification({
        title: t('successTitle'),
        message: t('successMessage'),
        icon: <IconCheck stroke={1.5} />,
        color: 'green',
      });

      close();
    });
  };

  const showDeleteModal = (id: string, content: React.ReactNode) => {
    setId(id);
    setModalContent(content);
    open();
  };

  return (
    <DeleteServiceModalContext.Provider value={{ showDeleteModal }}>
      {children}
      <Modal opened={opened} onClose={close} title={t('modalTitle')}>
        <Stack>
          {t('confirmationMessage', { berthCode })}
          {modalContent}
          <Group grow>
            <Button variant="outline" onClick={close}>
              {t('cancelButtonLabel')}
            </Button>
            <Button
              color="red"
              onClick={handleSubmit}
              loading={deleteIsPending}>
              {t('deleteButtonLabel')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </DeleteServiceModalContext.Provider>
  );
}

export const useDeleteServiceModal = (): DeleteServiceModalContextProps => {
  const context = useContext(DeleteServiceModalContext);
  if (context === null)
    throw new Error(
      'useDeleteServiceModal must be used within a DeleteServiceModalContext.Provider.'
    );
  return context;
};
