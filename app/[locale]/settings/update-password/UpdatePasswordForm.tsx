'use client';

import { useProgressBar } from '@/app/components/ProgressBar';
import { useAuthErrorModal, useSuccessModal } from '@/app/hooks/feedback';
import { createClient } from '@/lib/supabase/client';
import { Button, Fieldset, PasswordInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface FormValues {
  password: string;
  passwordAgain: string;
}

export function UpdatePasswordForm() {
  const t = useTranslations('UpdatePasswordForm');
  const progress = useProgressBar();
  const [updateSuccessful, setUpdateSuccessful] = useState<boolean>(false);
  const supabase = createClient();
  const { showErrorModalWithDetails } = useAuthErrorModal();
  const { showSuccessModal } = useSuccessModal();

  const form = useForm<FormValues>({
    initialValues: {
      password: '',
      passwordAgain: '',
    },
    validate: {
      password: (value) => (value.length >= 8 ? null : t('validate.password')),
      passwordAgain: (value, values) =>
        value === values.password ? null : t('validate.passwordAgain'),
    },
    validateInputOnBlur: true,
  });

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset
        pos="relative"
        variant="unstyled"
        disabled={progress.state === 'in-progress' || updateSuccessful}>
        <Stack>
          <PasswordInput
            name="password"
            label={t('password')}
            placeholder={t('password')}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            name="passwordAgain"
            label={t('passwordAgain')}
            placeholder={t('passwordAgain')}
            {...form.getInputProps('passwordAgain')}
          />
          <Button type="submit" disabled={!form.isValid()}>
            {t('submit')}
          </Button>
        </Stack>
      </Fieldset>
    </form>
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password'));

    progress.start();

    const { error } = await supabase.auth.updateUser({
      password,
    });

    progress.done();

    if (error) {
      if (error.code === 'same_password') {
        form.setFieldError('password', t('samePasswordMessage'));
      } else {
        showErrorModalWithDetails(error);
      }
    } else {
      setUpdateSuccessful(true);
      showSuccessModal({ content: t('successMessage') });
    }
  }
}
