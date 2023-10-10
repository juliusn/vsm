'use client';

import { useEffect, useRef } from 'react';
import { useProfileStore } from '../store';

export function ProfileStoreInitializer({
  profile,
}: {
  profile: Profile | null;
}) {
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      useProfileStore.setState({ profile });
      initialized.current = true;
    }
  }, []);
  return null;
}
