import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

const locales: ReadonlyArray<'en' | 'fi'> = ['en', 'fi'];

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',
});

export const { Link, usePathname, useRouter } = createNavigation(routing);

const { redirect: _redirect } = createNavigation(routing);
export const redirect: typeof _redirect = _redirect;
