import { RegisterForm } from '@/app/components/RegisterForm';
import { Anchor, Container, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function RegisterPage() {
  const t = useTranslations('RegisterPage');
  return (
    <Container size="24rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <RegisterForm />
        <Text>
          {t.rich('alreadyHaveAccount', {
            link: (text) => (
              <Anchor component={Link} href="/login">
                {text}
              </Anchor>
            ),
          })}
        </Text>
      </Stack>
    </Container>
  );
}
