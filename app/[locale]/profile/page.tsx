import { createClient } from '@/lib/supabase/server';
import { Center, Stack, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { ProfileContent } from './ProfileContent';

export default async function ProfilePage() {
  const t = await getTranslations('ProfilePage');
  const supabase = createClient();
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    return <Title size="h4">No Session</Title>;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', sessionData.session.user.id)
    .single();

  return (
    <Center>
      <Stack>
        <Title size="h4">{t('title')}</Title>
        {profile && <ProfileContent profile={profile} />}
      </Stack>
    </Center>
  );
}
