'use client';

import { useEffect, useRef } from 'react';
import { useSessionStore } from '../store';
import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';

export function AuthListener() {
  const setSession = useSessionStore((state) => state.setSession);
  const supabase = createClient();
  const currentSessionRef = useRef<Session | null>(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === 'SIGNED_IN' ||
          event === 'INITIAL_SESSION' ||
          event === 'TOKEN_REFRESHED'
        ) {
          if (
            session &&
            session.access_token !== currentSessionRef.current?.access_token
          ) {
            currentSessionRef.current = session;
            setSession(session);
          }
        } else if (event === 'SIGNED_OUT') {
          if (currentSessionRef.current) {
            currentSessionRef.current = null;
            setSession(null);
          }
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [setSession, supabase]);

  return null;
}
