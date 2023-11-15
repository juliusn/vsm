'use server';

import { User, createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

type RegisterResponse = {
  status: number | undefined;
  profile: Profile | null;
};

export async function register(formData: FormData): Promise<RegisterResponse> {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const account_type = String(formData.get('accountType'));
  const user_name = String(formData.get('userName'));
  const userNameResponse = await checkUserName(user_name);

  if (userNameResponse.ok && userNameResponse.userNameExists) {
    return { status: 400, profile: null };
  }

  const supabase = createServerActionClient({ cookies });
  const referer = headers().get('referer');

  if (!referer) {
    return { status: 400, profile: null };
  }

  const url = new URL(referer);
  const {
    error,
    data: { user },
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${url.origin}/auth/callback`,
      data: {
        account_type,
        user_name,
      },
    },
  });

  if (error) {
    return { status: error.status, profile: null };
  }

  if (!user) {
    return { status: 400, profile: null };
  }

  const profile = await getProfile(user);

  return { status: 200, profile };
}

export async function login(formData: FormData) {
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return {
    profile: user ? await getProfile(user) : null,
    status: error ? error.status : 200,
  };
}

export const getProfile = async (user: User) => {
  const supabase = createServerActionClient<Database>({ cookies });
  const { data: profile, error } = await supabase
    .from('profiles')
    .select()
    .eq('id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return profile;
};

export const getUser = async () => {
  const supabase = createServerActionClient<Database>({ cookies });
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return user;
};

export async function logout() {
  const supabase = createServerActionClient<Database>({ cookies });
  return supabase.auth.signOut();
}

type CheckUserNameResponse =
  | {
      ok: true;
      userNameExists: boolean;
    }
  | {
      ok: false;
    };

export async function checkUserName(
  userName: string
): Promise<CheckUserNameResponse> {
  const supabase = createServerActionClient<Database>({ cookies });
  const { error, count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('user_name', userName);

  if (error) {
    return { ok: false };
  }

  return {
    ok: true,
    userNameExists: !!count,
  };
}
