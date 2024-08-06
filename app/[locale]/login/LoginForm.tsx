'use client';

import {
  Button,
  Fieldset,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconCheck, IconLogin2 } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useEmailStore } from '../../store';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { createClient } from '@/lib/supabase/client';
import { startTransition } from 'react';
import { ErrorModal } from '@/app/components/ErrorModal';
import { ProgressBarLink, useProgressBar } from '@/app/components/ProgressBar';
import { showNotification } from '@mantine/notifications';

interface FormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const t = useTranslations('Login');
  const [errorModalOpened, { open: openErrorModal, close: closeErrorModal }] =
    useDisclosure(false);
  const router = useRouter();
  const progress = useProgressBar();
  const email = useEmailStore((store) => store.email);
  const setEmail = useEmailStore((store) => store.setEmail);

  const form = useForm<FormValues>({
    initialValues: {
      email,
      password: '',
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? null
          : t('validate.email'),
      password: (value) => (value.length >= 8 ? null : t('validate.password')),
    },
    validateInputOnBlur: true,
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Fieldset
          variant="unstyled"
          disabled={progress.state === 'in-progress'}>
          <Stack pos="relative">
            <TextInput
              name="email"
              label={t('email')}
              placeholder={t('email')}
              {...form.getInputProps('email')}
              onChange={(event) => {
                form.setFieldValue('email', event.target.value);
                setEmail(event.target.value);
              }}
            />
            <PasswordInput
              name="password"
              label={t('password')}
              placeholder={t('password')}
              {...form.getInputProps('password')}
            />
            <Button
              type="submit"
              disabled={!form.isValid()}
              leftSection={<IconLogin2 stroke={1.5} />}
              rightSection={<span className="w-6"></span>}
              justify="space-between"
              className="mt-2">
              {t('submit')}
            </Button>
            <ProgressBarLink href="/reset-password">
              {t('forgot')}
            </ProgressBarLink>
          </Stack>
        </Fieldset>
      </form>
      <ErrorModal
        opened={errorModalOpened}
        onClose={closeErrorModal}
        title={t('error')}>
        {t('loginError')}
      </ErrorModal>
    </>
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    progress.start();
    const { email, password } = form.values;
    const supabase = createClient();

    startTransition(async () => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        progress.done();
        openErrorModal();
        return;
      }

      showNotification({
        title: t('loggedInTitle'),
        message: t.rich('loggedInMessage', {
          name: data.user.user_metadata.first_name,
        }),
        icon: <IconCheck stroke={1.5} />,
        color: 'green',
      });

      startTransition(() => {
        router.push('/');
        progress.done();
      });
    });
  }
}
