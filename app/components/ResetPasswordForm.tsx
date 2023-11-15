'use client';

import { Button, LoadingOverlay, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconMail } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export function ResetPasswordForm({}: {}) {
  const t = useTranslations('ResetPasswordPage');
  const searchParams = useSearchParams();
  const form = useForm<{ email: string }>({
    initialValues: {
      email: searchParams.get('email') || '',
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? null
          : t('invalidEmail'),
    },
    validateInputOnBlur: true,
  });
  const [loading, { open: openLoading }] = useDisclosure(false);
  return (
    <form action="/auth/reset-password" method="post" onSubmit={openLoading}>
      <Stack pos="relative">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <TextInput
          name="email"
          label={t('email')}
          placeholder={t('email')}
          {...form.getInputProps('email')}
        />
        <Button
          type="submit"
          disabled={!form.isValid() || loading}
          leftSection={<IconMail stroke={1.5} />}
          rightSection={<span className="w-6"></span>}
          justify="space-between"
          className="mt-2">
          {t('submit')}
        </Button>
      </Stack>
    </form>
  );
}
