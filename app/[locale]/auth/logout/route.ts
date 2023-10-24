import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { error } = await supabase.auth.signOut();
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  const url = new URL(`/login`, request.url);
  redirect(url.href);
}
