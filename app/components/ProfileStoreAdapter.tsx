'use client';

import { useEffect } from 'react';
import { useProfileStore } from '../store';

export function ProfileStoreAdapter({ profile }: { profile: Profile | null }) {
  const setProfile = useProfileStore((state) => state.setProfile);
  useEffect(() => {
    setProfile(profile);
  }, [profile]);
  return null;
}
