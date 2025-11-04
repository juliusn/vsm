import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { redirect } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { getLocale } from 'next-intl/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const locale = await getLocale();

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (error) {
      if (error.status === 403) {
        redirect({ href: '/resend', locale });
      }

      redirect({
        href: {
          pathname: '/error',
          query: { status: error.status, message: error.message },
        },
        locale,
      });
    }

    redirect({ href: '/welcome', locale });
  }

  redirect({ href: '/error', locale });
}
