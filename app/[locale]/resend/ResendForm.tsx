'use client';

import { useProgressBar } from '@/app/components/ProgressBar';
import { useAuthErrorModal, useSuccessModal } from '@/app/hooks/feedback';
import { useEmailStore } from '@/app/store';
import { createClient } from '@/lib/supabase/client';
import { Button, Fieldset, Stack, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { IconMail } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function ResendForm() {
  const t = useTranslations('ResendForm');
  const supabase = createClient();
  const progress = useProgressBar();
  const email = useEmailStore((state) => state.email);
  const { showErrorModalWithDetails } = useAuthErrorModal();
  const { showSuccessModal } = useSuccessModal();

  const form = useForm<{ email: string }>({
    initialValues: {
      email,
    },
    validate: {
      email: isEmail(t('invalidEmail')),
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));
    progress.start();

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    progress.done();

    if (error) {
      showErrorModalWithDetails(error);
    } else {
      showSuccessModal({
        title: t('successTitle'),
        content: t('successMessage'),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset disabled={progress.state !== 'initial'}>
        <Stack>
          <TextInput
            name="email"
            label={t('email')}
            placeholder={t('email')}
            {...form.getInputProps('email')}></TextInput>
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
  );
}
