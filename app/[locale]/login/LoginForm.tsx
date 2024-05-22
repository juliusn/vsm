'use client';

import {
  Button,
  Fieldset,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconLogin2 } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useEmailStore } from '../../store';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/navigation';
import { createClient } from '@/lib/supabase/client';
import { startTransition } from 'react';
import { ErrorModal } from '@/app/components/ErrorModal';

interface FormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const t = useTranslations('Login');
  const [loading, { open: openLoading, close: closeLoading }] =
    useDisclosure(false);
  const [errorModalOpened, { open: openErrorModal, close: closeErrorModal }] =
    useDisclosure(false);
  const router = useRouter();
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
        <Fieldset variant="unstyled" disabled={loading}>
          <Stack pos="relative">
            <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm' }} />
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
            <Link href="/reset-password">{t('forgot')}</Link>
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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openLoading();
    const { email, password } = form.values;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      closeLoading();
      openErrorModal();
      return;
    }

    startTransition(() => {
      router.push('/');
      closeLoading();
    });
  }
}
