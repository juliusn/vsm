'use client';

import { useCommonServices } from '@/app/context/CommonServiceContext';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { Button, Group, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useState, useTransition } from 'react';

interface Props {
  showDeleteModal: (id: string, content: React.ReactNode) => void;
}

const Context = createContext<Props | null>(null);

export function DeleteServiceModalProvider({
  children,
  berthCode,
}: {
  children: React.ReactNode;
  berthCode: string;
}) {
  const t = useTranslations('DeleteServiceModalProvider');
  const getErrorNotification = usePostgresErrorNotification();
  const { dispatch } = useCommonServices();
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

      dispatch({ type: 'deleted', id });

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
    <Context.Provider value={{ showDeleteModal }}>
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
    </Context.Provider>
  );
}

export const useDeleteServiceModal = (): Props => {
  const context = useContext(Context);
  if (context === null)
    throw new Error(
      'useDeleteServiceModal must be used within DeleteServiceModalProvider.'
    );
  return context;
};
