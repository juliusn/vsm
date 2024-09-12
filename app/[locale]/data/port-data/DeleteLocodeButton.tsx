'use client';

import { ActionIcon, Button, Group, Stack } from '@mantine/core';
import { IconCheck, IconExclamationMark, IconTrash } from '@tabler/icons-react';
import { useModal } from './ModalProvider';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { showNotification } from '@mantine/notifications';
import { useRouter } from '@/navigation';

export function RemoveLocodeButton({ locode }: { locode: string }) {
  const router = useRouter();
  const t = useTranslations('RemoveLocodeButton');
  const supabase = createClient();
  const { showModal, closeModal } = useModal();
  const [deleteIsPending, startDelete] = useTransition();
  const deleteLocode = () => {
    startDelete(async () => {
      const response = await supabase
        .from('locodes')
        .delete()
        .eq('locode', locode);
      if (response.error) {
        showNotification({
          title: t('errorTitle'),
          message: t.rich('errorMessage', { status: response.status }),
          icon: <IconExclamationMark stroke={1.5} />,
          color: 'red',
        });
        return;
      }
      showNotification({
        title: t('successTitle'),
        message: t.rich('successMessage', { locode }),
        icon: <IconCheck stroke={1.5} />,
        color: 'green',
      });
      closeModal();
      router.refresh();
    });
  };
  const content = (
    <Stack>
      {t.rich('modalMessage', { locode })}
      <Group grow>
        <Button
          variant="outline"
          onClick={(event) => {
            event.preventDefault();
            closeModal();
          }}>
          {t('cancel')}
        </Button>
        <Button
          color="red"
          loading={deleteIsPending}
          onClick={(event) => {
            event.preventDefault();
            deleteLocode();
          }}>
          {t('remove')}
        </Button>
      </Group>
    </Stack>
  );
  return (
    <ActionIcon
      variant="subtle"
      color="red"
      onClick={(event) => {
        event.preventDefault();
        showModal(t('modalTitle'), content);
      }}>
      <IconTrash stroke={1.5} />
    </ActionIcon>
  );
}
