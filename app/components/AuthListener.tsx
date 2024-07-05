'use client';

import { useEffect, useRef } from 'react';
import { useSessionStore } from '../store';
import { createClient } from '@/lib/supabase/client';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { IconCheck } from '@tabler/icons-react';

export function AuthListener() {
  const setSession = useSessionStore((state) => state.setSession);
  const supabase = createClient();
  const currentJWTRef = useRef<string | null>(null);
  const initialLoadRef = useRef(true);
  const t = useTranslations('AuthListener');

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === 'SIGNED_IN' ||
          event === 'INITIAL_SESSION' ||
          event === 'TOKEN_REFRESHED'
        ) {
          if (session && session.access_token !== currentJWTRef.current) {
            currentJWTRef.current = session.access_token;
            setSession(session);
            if (!initialLoadRef.current) {
              showNotification({
                title: t('loggedInTitle'),
                message: t.rich('loggedInMessage', {
                  name: session.user.user_metadata.first_name,
                }),
                icon: <IconCheck stroke={1.5} />,
                color: 'green',
              });
            }
          }
        } else if (event === 'SIGNED_OUT') {
          if (currentJWTRef.current) {
            currentJWTRef.current = null;
            setSession(null);
            if (!initialLoadRef.current) {
              showNotification({
                title: t('loggedOutTitle'),
                message: t('loggedOutMessage'),
                icon: <IconCheck stroke={1.5} />,
                color: 'green',
              });
            }
          }
        }

        if (initialLoadRef.current) {
          initialLoadRef.current = false;
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession, supabase, t]);

  return null;
}
