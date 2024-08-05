import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { locales } from './config';
import { updateSession } from './lib/supabase/middleware';

const handleI18nRouting = createMiddleware({
  locales,
  defaultLocale: 'fi',
});

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  await updateSession(request);
  return response;
}

export const config = {
  matcher: ['/', '/(fi|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
