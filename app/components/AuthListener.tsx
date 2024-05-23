'use client';

import { useEffect } from 'react';
import { useProfileStore } from '../store';
import { createClient } from '@/lib/supabase/client';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { IconCheck } from '@tabler/icons-react';

export function AuthListener() {
  const setProfile = useProfileStore((state) => state.setProfile);
  const profile = useProfileStore((state) => state.profile);
  const supabase = createClient();
  const t = useTranslations('AuthListener');

  useEffect(() => {
    const updateProfile = async (id: string) => {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('id', id)
        .single();
      setProfile(data);
    };

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await updateProfile(session.user.id);
      } else {
        setProfile(null);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          if (profile?.id !== session.user.id) {
            showNotification({
              title: t('loggedInTitle'),
              message: t('loggedInMessage', {
                name: session.user.user_metadata.user_name,
              }),
              icon: <IconCheck stroke={1.5} />,
              color: 'green',
            });
            setTimeout(async () => {
              await updateProfile(session.user.id);
            });
          }
        } else if (event === 'SIGNED_OUT') {
          showNotification({
            title: t('loggedOutTitle'),
            message: t('loggedOutMessage'),
            icon: <IconCheck stroke={1.5} />,
            color: 'green',
          });
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setProfile, profile, t, supabase]);
  return null;
}
