import { Container, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  return (
    <Container size="24rem">
      <ProfileContent />
    </Container>
  );
}

function ProfileContent() {
  const t = useTranslations('ProfilePage');
  return (
    <Stack>
      <Title size="h4">{t('title')}</Title>
    </Stack>
  );
}
