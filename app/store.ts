import { Session } from '@supabase/supabase-js';
import { create } from 'zustand';

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

type UserMetadata = Session['user']['user_metadata'];

export type AuthUser = {
  userMetadata: UserMetadata;
  admin: boolean;
};

type AuthStore = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: AuthUser | null) => {
    set(() => ({ user }));
  },
}));
