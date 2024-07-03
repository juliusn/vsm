import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

type SessionStore = {
  session: Session | null;
  setSession: (session: Session | null) => void;
};

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  setSession: (session) => {
    set(() => ({ session }));
  },
}));

type EmailStore = {
  email: string;
  setEmail: (email: string) => void;
};

export const useEmailStore = create<EmailStore>((set) => ({
  email: '',
  setEmail: (email) => {
    set(() => ({ email }));
  },
}));
