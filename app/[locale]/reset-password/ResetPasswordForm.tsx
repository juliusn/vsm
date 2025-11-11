'use client';

import { useProgressBar } from '@/app/components/ProgressBar';
import { SuccessModal } from '@/app/components/SuccessModal';
import { useAuthErrorModal } from '@/app/hooks/feedback';
import { createClient } from '@/lib/supabase/client';
import { Button, Fieldset, Stack, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconMail } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEmailStore } from '../../store';

export function ResetPasswordForm() {
  const locale = useLocale();
  const email = useEmailStore((store) => store.email);
  const t = useTranslations('ResetPassword');
  const supabase = createClient();
  const progress = useProgressBar();
  const { showErrorModalWithDetails } = useAuthErrorModal();

  const [
    successModalOpened,
    { open: openSuccessModal, close: closeSuccessModal },
  ] = useDisclosure(false);

  const form = useForm<{ email: string }>({
    initialValues: {
      email,
    },
    validate: {
      email: isEmail(t('invalidEmail')),
    },
    validateInputOnBlur: true,
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Fieldset disabled={progress.state !== 'initial'}>
          <Stack pos="relative">
            <TextInput
              name="email"
              label={t('email')}
              placeholder={t('email')}
              {...form.getInputProps('email')}
            />
            <Button
              type="submit"
              disabled={!form.isValid()}
              loading={progress.state === 'in-progress'}
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
        </Fieldset>
      </form>
      <SuccessModal
        opened={successModalOpened}
        onClose={closeSuccessModal}
        title={t('emailSent')}>
        {t('checkYourEmail')}
      </SuccessModal>
    </>
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));
    const url = new URL(
      `/${locale}/settings/update-password`,
      window.location.origin
    );

    progress.start();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: url.href,
    });

    progress.done();

    if (error) {
      showErrorModalWithDetails(error);
    } else {
      openSuccessModal();
    }
  }
}
