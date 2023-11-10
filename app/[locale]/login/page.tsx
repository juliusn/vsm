import { LoginForm } from '@/app/components/LoginForm';
import { Anchor, Container } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  return (
    <Container size="20rem">
      <LoginForm
        title={t('title')}
        labelEmail={t('email')}
        labelValidateEmail={t('validate.email')}
        labelPassword={t('password')}
        labelValidatePassword={t('validate.password')}
        submit={t('submit')}
        forgotPassword={t('forgot')}
        textNoAccount={t.rich('noAccount', {
          link: (text) => (
            <Anchor component={Link} href="/register">
              {text}
            </Anchor>
          ),
        })}
      />
    </Container>
  );
}
