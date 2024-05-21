import { Pathnames } from 'next-intl/navigation';

export const locales: ReadonlyArray<string> = ['en', 'fi'];

export const pathnames = {
  '/': '/',
  '/pathnames': {
    en: '/pathnames',
    fi: '/pfadnamen',
  },
} satisfies Pathnames<typeof locales>;

export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
