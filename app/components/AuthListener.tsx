'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useRef } from 'react';
import { useSessionStore } from '../store';

export function AuthListener() {
  const setSession = useSessionStore((state) => state.setSession);
  const supabase = createClient();
  const currentJWTRef = useRef<string | null>(null);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    if (typeof window === 'undefined') throw new Error(`where's my window?`);
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          if (session && session.access_token !== currentJWTRef.current) {
            currentJWTRef.current = session.access_token;
            setSession(session);
          }
        } else if (
          event === 'TOKEN_REFRESHED' &&
          session &&
          session.access_token !== currentJWTRef.current
        ) {
          currentJWTRef.current = session.access_token;
          setSession(session);
        } else if (event === 'SIGNED_OUT') {
          if (currentJWTRef.current) {
            currentJWTRef.current = null;
            setSession(null);
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
  }, [setSession, supabase]);

  return null;
}
