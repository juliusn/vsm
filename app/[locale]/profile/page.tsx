import { createClient } from '@/lib/supabase/server';
import { Center, Stack, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { ProfileContent } from './ProfileContent';
import { redirect } from '@/i18n/routing';

export default async function ProfilePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const t = await getTranslations('ProfilePage');
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    redirect({ href: '/login', locale });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select()
    .eq('id', data.user.id)
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
