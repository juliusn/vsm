'use client';

import { reducer } from '@/lib/reducer';
import { Action } from '@/lib/types/context';
import { Profile } from '@/lib/types/query-types';
import { createContext, Dispatch, useContext, useReducer } from 'react';

type ContextType = {
  profiles: Profile[];
  dispatchProfiles: Dispatch<Action<Profile>>;
};

type Props = {
  children: React.ReactNode;
  initialProfiles: Profile[];
};

const ProfileContext = createContext<ContextType | null>(null);

export const ProfileProvider = ({ children, initialProfiles }: Props) => {
  const [profiles, dispatchProfiles] = useReducer(
    reducer<Profile>,
    initialProfiles
  );

  return (
    <ProfileContext.Provider
      value={{
        profiles,
        dispatchProfiles,
      }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfiles = () => {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useProfiles must be used within ProfileProvider.');
  }

  return context;
};
