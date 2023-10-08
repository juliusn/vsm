import { Container, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const t = useTranslations('SettingsPage');
  return (
    <Container size="24rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
      </Stack>
    </Container>
  );
}
