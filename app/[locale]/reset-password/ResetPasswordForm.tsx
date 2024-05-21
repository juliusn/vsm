'use client';

import { Button, LoadingOverlay, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconExclamationMark, IconMail } from '@tabler/icons-react';
import { useEmailStore } from '../../store';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useLocale, useTranslations } from 'next-intl';
import SuccessModal from '@/app/components/SuccessModal';

export function ResetPasswordForm() {
  const locale = useLocale();
  const email = useEmailStore((store) => store.email);
  const t = useTranslations('ResetPassword');
  const form = useForm<{ email: string }>({
    initialValues: {
      email,
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? null
          : t('invalidEmail'),
    },
    validateInputOnBlur: true,
  });
  const [loading, { open: openLoading, close: closeLoading }] =
    useDisclosure(false);
  const [emailSent, setEmailSent] = useState(false);
  const [
    emailResetModalOpened,
    { open: openEmailResetModal, close: closeEmailResetModal },
  ] = useDisclosure(false);
  const supabase = createClient();

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Stack pos="relative">
          <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm' }} />
          <TextInput
            name="email"
            label={t('email')}
            placeholder={t('email')}
            {...form.getInputProps('email')}
          />
          <Button
            type="submit"
            disabled={!form.isValid() || loading || emailSent}
            leftSection={<IconMail stroke={1.5} />}
            rightSection={<span className="w-6 invisible"></span>}
            justify="space-between"
            className="mt-2"
            styles={{
              label: {
                overflow: 'visible',
              },
            }}>
            {t('submit')}
          </Button>
        </Stack>
      </form>
      <SuccessModal
        opened={emailResetModalOpened}
        onClose={closeEmailResetModal}
        title={t('emailSent')}>
        {t('checkYourEmail')}
      </SuccessModal>
    </>
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));
    const url = new URL(`/${locale}/update-password`, window.location.origin);

    openLoading();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: url.href,
    });

    closeLoading();

    if (error) {
      showNotification({
        title: t('error'),
        message: t('resetPasswordError'),
        icon: <IconExclamationMark stroke={1.5} />,
        color: 'red',
      });
    } else {
      setEmailSent(true);
      openEmailResetModal();
    }
  }
}
