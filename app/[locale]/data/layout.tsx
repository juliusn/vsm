import { Container, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { DataNavigation } from './DataNavigation';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('Data');
  return (
    <Container>
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <DataNavigation />
        {children}
      </Stack>
    </Container>
  );
}
