'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { NavLink } from '@mantine/core';
import { startTransition } from 'react';
import { useProgressBar } from './ProgressBar';

export function HeaderNavbarLinks({
  navItems,
  toggle,
}: {
  navItems: { label: string; href: string }[];
  toggle(): void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const current = `/${pathname.split('/')[1]}`;
  const progress = useProgressBar();

  return navItems.map(({ label, href }) => (
    <NavLink
      key={label}
      label={label}
      active={current === href}
      onClick={(event) => {
        event.preventDefault();
        toggle();
        progress.start();
        startTransition(() => {
          router.push(href);
          progress.done();
        });
      }}
    />
  ));
}
