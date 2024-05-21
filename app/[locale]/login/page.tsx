import { LoginForm } from '@/app/[locale]/login/LoginForm';
import { Link } from '@/navigation';
import { Container, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Login');

  return (
    <Container size="20rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <LoginForm />
        <Text>
          {t.rich('noAccount', {
            link: (text) => <Link href="/register">{text}</Link>,
          })}
        </Text>
      </Stack>
    </Container>
  );
}
