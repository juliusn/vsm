import { LoginForm } from '@/app/[locale]/login/LoginForm';
import { ProgressBarLink } from '@/app/components/ProgressBar';
import { Container, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Login');

  return (
    <Container size="20rem">
      <Stack pb="md">
        <Title size="h4">{t('title')}</Title>
        <LoginForm />
        <Text>
          {t.rich('noAccount', {
            link: (text) => (
              <ProgressBarLink href="/register">{text}</ProgressBarLink>
            ),
          })}
        </Text>
      </Stack>
    </Container>
  );
}
