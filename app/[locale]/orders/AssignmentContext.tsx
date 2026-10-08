'use client';

import { AssignmentProfile } from '@/lib/types/query-types';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';

export type InvitationStatus =
  | 'notInvited'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'declined';

type ContextType = {
  profiles: AssignmentProfile[];
  invitationStatuses: Record<string, Record<string, InvitationStatus>>;
};

const Context = createContext<ContextType | null>(null);

export function AssignmentProvider({
  children,
  profiles,
}: {
  children: ReactNode;
  profiles: AssignmentProfile[];
}) {
  const value: ContextType = useMemo(
    () => ({
      profiles,
      invitationStatuses: {},
    }),
    [profiles]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAssignments() {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useAssignments must be used within AssignmentProvider');
  }

  return context;
}
