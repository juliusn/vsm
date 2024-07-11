import { RegisterForm } from '@/app/[locale]/register/RegisterForm';
import { ProgressBarLink } from '@/app/components/ProgressBar';
import { Container, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function RegisterPage() {
  const t = useTranslations('Register');
  return (
    <Container size="24rem">
      <Stack pb="md">
        <Title size="h4">{t('title')}</Title>
        <RegisterForm />
        <Text>
          {t.rich('alreadyHaveAccount', {
            link: (text) => (
              <ProgressBarLink href="/login">{text}</ProgressBarLink>
            ),
          })}
        </Text>
      </Stack>
    </Container>
  );
}
