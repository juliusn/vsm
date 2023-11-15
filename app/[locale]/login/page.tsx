import { LoginForm } from '@/app/components/LoginForm';
import { Anchor, Container, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  return (
    <Container size="20rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <LoginForm />
        <Text>
          {t.rich('noAccount', {
            link: (text) => (
              <Anchor component={Link} href="/register">
                {text}
              </Anchor>
            ),
          })}
        </Text>
      </Stack>
    </Container>
  );
}
