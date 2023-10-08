import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getTranslator } from 'next-intl/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } }
) {
  const t = await getTranslator(locale, 'auth/register');
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const account_type = String(formData.get('accountType'));
  const user_name = String(formData.get('userName'));
  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${requestUrl.origin}/auth/callback`,
      data: {
        account_type,
        user_name,
      },
    },
  });

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/register?error=${error.status}, ${error.message}`,
      {
        status: 301,
      }
    );
  }

  return NextResponse.redirect(
    `${requestUrl.origin}/register?message=${t('checkEmail')}`,
    {
      status: 301,
    }
  );
}
