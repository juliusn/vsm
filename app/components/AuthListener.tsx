'use client';

import { useEffect } from 'react';
import { useProfileStore } from '../store';
import { createClient } from '@/lib/supabase/client';

export function AuthListener() {
  const setProfile = useProfileStore((state) => state.setProfile);
  const profile = useProfileStore((state) => state.profile);
  const supabase = createClient();

  useEffect(() => {
    async function udpateProfile(id: string) {
      const { data } = await supabase
        .from('profiles')
        .select()
        .eq('id', id)
        .single();
      setProfile(data);
    }

    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await udpateProfile(session.user.id);
      } else {
        setProfile(null);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          if (profile?.id !== session.user.id) {
            setTimeout(async () => {
              await udpateProfile(session.user.id);
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [setProfile, profile?.id, supabase]);
  return null;
}
