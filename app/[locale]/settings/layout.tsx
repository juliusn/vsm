import { Container, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('Settings');
  return (
    <Container size="24rem">
      <Stack>
        <Title size="h4">{t('title')}</Title>
        {children}
      </Stack>
    </Container>
  );
}
