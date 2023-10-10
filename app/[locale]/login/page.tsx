import {
  Anchor,
  Button,
  Container,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconLogin2 } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('LoginPage');
  return (
    <Container size="20rem">
      <form action="/auth/login" method="post">
        <Stack>
          <Title size="h4">{t('title')}</Title>
          <TextInput name="email" label={t('email')} placeholder={t('email')} />
          <PasswordInput
            name="password"
            label={t('password')}
            placeholder={t('password')}
          />
          <Button
            type="submit"
            leftSection={<IconLogin2 stroke={1.5} />}
            rightSection={<span className="w-6"></span>}
            justify="space-between"
            className="mt-2">
            {t('submit')}
          </Button>
          <Anchor href="/reset-password">{t('forgot')}</Anchor>
          <Text>
            {t.rich('noAccount', {
              link: (text) => <Anchor href="/register">{text}</Anchor>,
            })}
          </Text>
        </Stack>
      </form>
    </Container>
  );
}
