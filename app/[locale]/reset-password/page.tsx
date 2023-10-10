import { ResetPasswordForm } from '@/app/components/ResetPasswordForm';
import { Container } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function ResetPasswordPage({ title }: { title: string }) {
  const t = useTranslations('ResetPasswordPage');

  return (
    <Container size="20rem">
      <ResetPasswordForm
        title={t('title')}
        labelEmail={t('email')}
        labelInvalidEmail={t('invalidEmail')}
        submit={t('submit')}
      />
    </Container>
  );
}
