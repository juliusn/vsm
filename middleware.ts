import { hasLocale } from 'next-intl';
import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';

const handleI18nRouting = createMiddleware(routing);

const publicPages = [
  '/login',
  '/register',
  '/error',
  '/resend',
  '/reset-password',
  '/settings/update-password',
  '/auth/confirm',
];

const publicPathnameRegex = RegExp(
  `^(/(${routing.locales.join('|')}))?(${publicPages
    .flatMap((p) => (p === '/' ? ['', '/'] : p))
    .join('|')})/?$`,
  'i'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublicPage = publicPathnameRegex.test(pathname);
  const i18nResponse = handleI18nRouting(request);
  const { response, user } = await updateSession(request, i18nResponse);

  if (!user && !isPublicPage) {
    const seg = pathname.split('/')[1];
    const locale = hasLocale(routing.locales, seg)
      ? seg
      : routing.defaultLocale;
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/', '/(fi|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
