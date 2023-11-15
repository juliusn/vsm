'use client';

import {
  Anchor,
  Button,
  LoadingOverlay,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { IconLogin2 } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login } from '../actions';
import { useRouter } from 'next-intl/client';
import { useProfileStore } from '../store';
import { useTranslations } from 'next-intl';

interface FormValues {
  email: string;
  password: string;
}

export function LoginForm() {
  const t = useTranslations('LoginPage');
  const searchParams = useSearchParams();
  const [loading, { open: openLoading }] = useDisclosure(false);
  const form = useForm<FormValues>({
    initialValues: {
      email: searchParams.get('email') || '',
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
  const router = useRouter();
  const setProfile = useProfileStore((store) => store.setProfile);
  const handleRegister = async (formData: FormData) => {
    const { profile, status } = await login(formData);
    setProfile(profile);
    if (status === 400) {
      return;
    }
    router.push('/');
    router.refresh();
  };
  return (
    <form action={handleRegister} onSubmit={openLoading}>
      <Stack pos="relative">
        <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm' }} />
        <TextInput
          name="email"
          label={t('email')}
          placeholder={t('email')}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          name="password"
          label={t('password')}
          placeholder={t('password')}
          {...form.getInputProps('password')}
        />
        <Button
          type="submit"
          disabled={!form.isValid() || loading}
          leftSection={<IconLogin2 stroke={1.5} />}
          rightSection={<span className="w-6"></span>}
          justify="space-between"
          className="mt-2">
          {t('submit')}
        </Button>
        <Anchor
          component={Link}
          href={{
            pathname: '/reset-password',
            ...(form.getInputProps('email').value && {
              query: { email: form.getInputProps('email').value },
            }),
          }}>
          {t('forgot')}
        </Anchor>
      </Stack>
    </form>
  );
}
