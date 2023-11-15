import { ResetPasswordForm } from '@/app/components/ResetPasswordForm';
import { Container, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage() {
  const t = useTranslations('ResetPasswordPage');
  const title = t('title');
  return (
    <Container size="20rem">
      <Stack>
        <Title size="h4">{title}</Title>
        <ResetPasswordForm />
      </Stack>
    </Container>
  );
}
