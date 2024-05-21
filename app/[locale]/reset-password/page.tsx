import { ResetPasswordForm } from '@/app/[locale]/reset-password/ResetPasswordForm';
import { Container, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage() {
  const t = useTranslations('ResetPassword');
  return (
    <Container size="20rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <ResetPasswordForm />
      </Stack>
    </Container>
  );
}
