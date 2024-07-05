'use client';

import { useSessionStore } from '@/app/store';
import { createClient } from '@/lib/supabase/client';
import { Alert, Button, Checkbox, Group, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

export default function DeleteAccountPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [checked, setChecked] = useState(false);
  const t = useTranslations('DeleteAccountPage');
  const supabase = createClient();
  const router = useRouter();
  const setSession = useSessionStore((store) => store.setSession);
  const [isPending, startTransition] = useTransition();
  const deleteUser = () => {
    startTransition(async () => {
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
      router.push('/login');
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
            <Button color="red" loading={isPending} onClick={deleteUser}>
              {t('delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
