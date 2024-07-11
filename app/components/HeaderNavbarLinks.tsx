'use client';

import { usePathname, useRouter } from '@/navigation';
import { NavLink } from '@mantine/core';
import { startTransition } from 'react';
import { useProgressBar } from './ProgressBar';

export function HeaderNavbarLinks({
  navItems,
  toggle,
}: {
  navItems: { label: string; href: string }[];
  toggle: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const progress = useProgressBar();
  return navItems.map(({ label, href }) => (
    <NavLink
      key={label}
      label={label}
      active={pathname === href}
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
