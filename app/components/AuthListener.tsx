'use client';

import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '../store';

export function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);
  const supabase = createClient();
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    let latestRequest = 0;

    const updateClaims = async (
      userMetadata: Session['user']['user_metadata']
    ) => {
      const requestId = ++latestRequest;
      const { data } = await supabase.auth.getClaims();

      if (requestId === latestRequest) {
        if (data?.claims.app_metadata?.admin) {
          setUser({
            admin: true,
            userMetadata,
          });
        } else {
          setUser({ admin: false, userMetadata });
        }
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session) {
        const token = session.access_token;

        if (tokenRef.current !== token) {
          tokenRef.current = token;
          updateClaims(session.user.user_metadata);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setUser]);

  return null;
}
