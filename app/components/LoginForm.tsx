'use client';

import {
  Anchor,
  Button,
  LoadingOverlay,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconLogin2 } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';

export function LoginForm({
  title,
  labelEmail,
  labelValidateEmail,
  labelPassword,
  labelValidatePassword,
  submit,
  forgotPassword,
  textNoAccount,
}: {
  title: string;
  labelEmail: string;
  labelValidateEmail: string;
  labelPassword: string;
  labelValidatePassword: string;
  submit: string;
  forgotPassword: string;
  textNoAccount: React.ReactNode;
}) {
  const [loading, { open: openLoading }] = useDisclosure(false);
  interface FormValues {
    email: string;
    password: string;
  }
  const form = useForm<FormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? null
          : labelValidateEmail,
      password: (value) => (value.length >= 8 ? null : labelValidatePassword),
    },
    validateInputOnBlur: true,
  });
  return (
    <form action="/auth/login" method="post" onSubmit={openLoading}>
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
        <PasswordInput
          name="password"
          label={labelPassword}
          placeholder={labelPassword}
          {...form.getInputProps('password')}
        />
        <Button
          type="submit"
          disabled={!form.isValid() || loading}
          leftSection={<IconLogin2 stroke={1.5} />}
          rightSection={<span className="w-6"></span>}
          justify="space-between"
          className="mt-2">
          {submit}
        </Button>
        <Anchor href="/reset-password">{forgotPassword}</Anchor>
        <Text>{textNoAccount}</Text>
      </Stack>
    </form>
  );
}
