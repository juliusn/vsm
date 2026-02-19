import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const localeParam = searchParams.get('locale');
  const locale = hasLocale(routing.locales, localeParam)
    ? localeParam
    : await getLocale();

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      if (error.status === 403) {
        return NextResponse.redirect(new URL(`/${locale}/resend`, origin));
      }

      const url = new URL(`/${locale}/error`, origin);
      url.searchParams.set('message', error.message);

      if (error.status) {
        url.searchParams.set('status', String(error.status));
      }

      return NextResponse.redirect(url);
    }

    return NextResponse.redirect(new URL(`/${locale}/welcome`, origin));
  }

  return NextResponse.redirect(new URL(`/${locale}/error`, origin));
}
