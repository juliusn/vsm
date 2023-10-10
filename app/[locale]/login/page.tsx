import { LoginForm } from '@/app/components/LoginForm';
import { Anchor, Container } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  return (
    <Container size="20rem">
      <LoginForm
        title={t('title')}
        labelEmail={t('email')}
        labelPassword={t('password')}
        submit={t('submit')}
        forgotPassword={t('forgot')}
        textNoAccount={t.rich('noAccount', {
          link: (text) => <Anchor href="/register">{text}</Anchor>,
        })}
      />
    </Container>
  );
}
