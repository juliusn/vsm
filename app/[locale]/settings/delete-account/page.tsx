'use client';

import { useEmailStore } from '@/app/store';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { Alert, Button, Checkbox, Group, Modal, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { useState } from 'react';

export default function DeleteAccountPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [checked, setChecked] = useState(false);
  const t = useTranslations('DeleteAccountPage');
  const supabase = createClient();
  const router = useRouter();
  const setEmail = useEmailStore((store) => store.setEmail);
  const [deleteisPending, setDeleteIsPending] = useState(false);

  const deleteUser = async () => {
    setDeleteIsPending(true);
    const { error: deleteError } = await supabase.rpc('delete_user');
    const { error: signOutError } = await supabase.auth.signOut();
    setDeleteIsPending(false);

    if (deleteError || signOutError) {
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

    setEmail('');
    router.push('/login');
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
            <Button
              variant="outline"
              disabled={deleteisPending}
              onClick={close}>
              {t('cancel')}
            </Button>
            <Button color="red" loading={deleteisPending} onClick={deleteUser}>
              {t('delete')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
