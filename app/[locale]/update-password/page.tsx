import { Container, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { UpdatePasswordForm } from './UpdatePasswordForm';

export default async function UpdatePasswordPage() {
  return <UpdatePasswordContent />;
}

function UpdatePasswordContent() {
  const t = useTranslations('UpdatePassword');

  return (
    <Container size="20rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <UpdatePasswordForm />
      </Stack>
    </Container>
  );
}
