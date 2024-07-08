import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { createClient } from './lib/supabase/middleware';
import { locales } from './config';

const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale: 'fi',
});

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  const { supabase } = createClient(request);
  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: ['/', '/(fi|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
