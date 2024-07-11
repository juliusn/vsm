'use client';

import { useProgressBar } from '@/app/components/ProgressBar';
import { useEmailStore, useSessionStore } from '@/app/store';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/navigation';
import { Alert, Button, Checkbox, Group, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import {
  useState,
  useTransition,
  startTransition as redirectTransition,
} from 'react';

export default function DeleteAccountPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [checked, setChecked] = useState(false);
  const t = useTranslations('DeleteAccountPage');
  const supabase = createClient();
  const router = useRouter();
  const setSession = useSessionStore((store) => store.setSession);
  const setEmail = useEmailStore((store) => store.setEmail);
  const [deleteIsPending, startDelete] = useTransition();
  const progress = useProgressBar();
  const deleteUser = () => {
    startDelete(async () => {
      const { error } = await supabase.rpc('delete_user');
      if (error) {
        showNotification({
          title: t('errorTitle'),
          message: t('errorMessage'),
          icon: <IconExclamationMark stroke={1.5} />,
          color: 'red',
        });
        return;
      }
      showNotification({
        title: t('successTitle'),
        message: t('successMessage'),
        icon: <IconCheck stroke={1.5} />,
        color: 'green',
      });
      setSession(null);
      setEmail('');
      progress.start();
      redirectTransition(() => {
        router.push('/login');
        progress.done();
      });
    });
  };
  return (
    <>
      <Alert color="red" variant="outline" title={t('cautionTitle')}>
        <Stack>
          {t('cautionMessage')}
          <Checkbox
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
            label={t('iUnderstand')}
          />
          <Button color="red" onClick={open} disabled={!checked}>
            {t('delete')}
          </Button>
        </Stack>
      </Alert>
      <Modal
        opened={opened}
        onClose={close}
        title={t('confirmationTitle')}
        centered>
        <Stack>
          {t('confirmationMessage')}
          <Group grow>
            <Button variant="outline" onClick={close}>
              {t('cancel')}
            </Button>
            <Button color="red" loading={deleteIsPending} onClick={deleteUser}>
              {t('delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
