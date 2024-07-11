'use client';

import { Button, Fieldset, PasswordInput, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ErrorModal } from '@/app/components/ErrorModal';
import { ProgressBarLink, useProgressBar } from '@/app/components/ProgressBar';

interface FormValues {
  password: string;
  passwordAgain: string;
}

export function UpdatePasswordForm() {
  const t = useTranslations('UpdatePassword');
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
  const progress = useProgressBar();
  const [errorModalOpened, { open: openErrorModal, close: closeErrorModal }] =
    useDisclosure(false);
  const [updateSuccessful, setUpdateSuccessful] = useState<boolean>(false);
  const supabase = createClient();

  return (
    <>
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
      <ErrorModal
        opened={errorModalOpened}
        onClose={closeErrorModal}
        title={t('error')}>
        {t.rich('unavailableMessage', {
          link: (text) => (
            <ProgressBarLink href="/reset-password">{text}</ProgressBarLink>
          ),
        })}
      </ErrorModal>
    </>
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
      if (error.message === 'Auth session missing!') {
        openErrorModal();
      } else {
        const message =
          error.message ===
          'New password should be different from the old password.'
            ? t('passwordShouldBeDifferentError')
            : t('serverError');
        showNotification({
          title: t('error'),
          message: message,
          icon: <IconExclamationMark stroke={1.5} />,
          color: 'red',
        });
        form.setFieldError('password', message);
      }
    } else {
      setUpdateSuccessful(true);
      showNotification({
        title: t('done'),
        message: t('passwordUpdated'),
        icon: <IconCheck stroke={1.5} />,
        color: 'green',
      });
    }
  }
}
