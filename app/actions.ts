'use server';

import {
  User,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getProfile = async (user: User) => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw profileError;
  }

  return profile;
};

export const getUser = async () => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return user;
};
