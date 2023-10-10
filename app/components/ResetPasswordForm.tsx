'use client';

import { Button, LoadingOverlay, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconMail } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';

export function ResetPasswordForm({
  title,
  labelEmail,
  labelInvalidEmail,
  submit,
}: {
  title: string;
  labelEmail: string;
  labelInvalidEmail: string;
  submit: string;
}) {
  const searchParams = useSearchParams();
  const form = useForm<{ email: string }>({
    initialValues: {
      email: searchParams.get('email') || '',
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? null
          : labelInvalidEmail,
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
        <Title size="h4">{title}</Title>
        <TextInput
          name="email"
          label={labelEmail}
          placeholder={labelEmail}
          {...form.getInputProps('email')}
        />
        <Button
          type="submit"
          disabled={!form.isValid() || loading}
          leftSection={<IconMail stroke={1.5} />}
          rightSection={<span className="w-6"></span>}
          justify="space-between"
          className="mt-2">
          {submit}
        </Button>
      </Stack>
    </form>
  );
}
