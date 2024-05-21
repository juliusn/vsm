import { RegisterForm } from '@/app/[locale]/register/RegisterForm';
import { Link } from '@/navigation';
import { Container, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('Register');
  return (
    <Container size="24rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <RegisterForm />
        <Text>
          {t.rich('alreadyHaveAccount', {
            link: (text) => <Link href="/login">{text}</Link>,
          })}
        </Text>
      </Stack>
    </Container>
  );
}
