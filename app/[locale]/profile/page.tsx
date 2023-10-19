import { useProfileStore } from '@/app/store';
const { getState } = useProfileStore;
import { Alert, Container, Stack, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function ProfilePage() {
  return (
    <Container size="24rem">
      <ProfileContent />
    </Container>
  );
}

function ProfileContent() {
  const { profile } = getState();
  const t = useTranslations('ProfilePage');
  return (
    <Stack>
      {profile ? (
        <>
          <Title size="h4">{t('title')}</Title>
          <Text>{profile?.user_name}</Text>
        </>
      ) : (
        <Alert>No profile!</Alert>
      )}
    </Stack>
  );
}
