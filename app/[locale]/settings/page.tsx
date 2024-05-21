import { useTranslations } from 'next-intl';
import { Container, Stack, Title } from '@mantine/core';
import { Link } from '@/navigation';

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');
  return (
    <Container size="24rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <Link href="/update-password">{t('changePassword')}</Link>
      </Stack>
    </Container>
  );
}
