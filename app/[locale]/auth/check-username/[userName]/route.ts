import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { getTranslator } from 'next-intl/server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _: NextRequest,
  {
    params: { locale, userName },
  }: { params: { locale: string; userName: string } }
) {
  const t = await getTranslator(locale, 'auth/check-username');
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase
    .from('profiles')
    .select('user_name')
    .eq('user_name', userName)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return NextResponse.json(
        {
          userExists: false,
          message: t('available'),
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        error: t('error'),
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      userExists: true,
      message: t('notAvailable'),
    },
    { status: 200 }
  );
}
