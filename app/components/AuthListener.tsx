'use client';

import { createClient } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { useAuthStore } from '../store';

export function AuthListener() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const supabase = createClient();
    let revision = 0;

    async function updateUser(session: Session, requestRevision: number) {
      try {
        const { data, error } = await supabase.auth.getClaims(
          session.access_token
        );

        if (requestRevision !== revision) return;

        if (error || !data) {
          setUser(null);
          return;
        }

        const metadata = data.claims.app_metadata;
        const status: unknown = metadata?.approval_status;

        if (
          status !== 'pending' &&
          status !== 'approved' &&
          status !== 'rejected'
        ) {
          setUser(null);
          return;
        }

        setUser({
          userMetadata: session.user.user_metadata,
          admin: metadata?.admin === true,
          approvalStatus: status,
        });
      } catch {
        if (requestRevision === revision) {
          setUser(null);
        }
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const requestRevision = ++revision;

      if (!session) {
        setUser(null);
        return;
      }

      // Run Auth calls after the event callback returns.
      setTimeout(() => {
        if (requestRevision === revision) {
          void updateUser(session, requestRevision);
        }
      }, 0);
    });

    return () => {
      revision++;
      subscription.unsubscribe();
    };
  }, [setUser]);

  return null;
}
