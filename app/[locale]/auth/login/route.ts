import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getTranslator } from 'next-intl/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params: { locale } }: { params: { locale: string } }
) {
  const t = await getTranslator(locale, 'auth/login');
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.status === 400) {
      const url = new URL('/login', request.url);
      url.searchParams.set('email', email);
      url.searchParams.set('error', t('invalidEmailOrPassword'));
      return NextResponse.redirect(url, {
        status: 301,
      });
    }
    const url = new URL('/login', request.url);
    url.searchParams.set('error', t('serverError'));
    return NextResponse.redirect(url, {
      status: 301,
    });
  }

  return NextResponse.redirect(requestUrl.origin, {
    status: 301,
  });
}
