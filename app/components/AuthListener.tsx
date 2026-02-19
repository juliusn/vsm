'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useRef } from 'react';
import { useSessionStore } from '../store';

export function AuthListener() {
  const setSession = useSessionStore((state) => state.setSession);
  const supabase = createClient();
  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') throw new Error(`where's my window?`);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
      } else if (session) {
        const token = session.access_token;
        if (tokenRef.current !== token) {
          tokenRef.current = token;
          setSession(session);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, setSession]);

  return null;
}
