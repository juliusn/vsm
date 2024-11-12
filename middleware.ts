import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  await updateSession(request);
  return response;
}

export const config = {
  matcher: ['/', '/(fi|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
