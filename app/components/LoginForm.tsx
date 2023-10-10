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

export function LoginForm({
  title,
  labelEmail,
  labelPassword,
  submit,
  forgotPassword,
  textNoAccount,
}: {
  title: string;
  labelEmail: string;
  labelPassword: string;
  submit: string;
  forgotPassword: string;
  textNoAccount: React.ReactNode;
}) {
  const [loading, { open: openLoading }] = useDisclosure(false);
  return (
    <form action="/auth/login" method="post" onSubmit={openLoading}>
      <Stack pos="relative">
        <LoadingOverlay
          visible={loading}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <Title size="h4">{title}</Title>
        <TextInput name="email" label={labelEmail} placeholder={labelEmail} />
        <PasswordInput
          name="password"
          label={labelPassword}
          placeholder={labelPassword}
        />
        <Button
          type="submit"
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
