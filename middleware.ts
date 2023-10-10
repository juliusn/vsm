import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fi'],
  defaultLocale: 'en',
});

export default async function middleware(req: NextRequest) {
  const defaultLocale = req.headers.get('x-default-locale') || 'en';
  const res = intlMiddleware(req);
  res.headers.set('x-default-locale', defaultLocale);
  const supabase = createMiddlewareClient<Database>({ req, res });
  await supabase.auth.getSession();
  return res;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
