'use client';

import { usePathname, useRouter } from '@/navigation';
import { NavLink } from '@mantine/core';

export function HeaderNavbarLinks({
  navItems,
  toggle,
}: {
  navItems: { label: string; href: string }[];
  toggle: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  return navItems.map(({ label, href }) => (
    <NavLink
      key={label}
      label={label}
      active={pathname === href}
      onClick={(event) => {
        event.preventDefault();
        toggle();
        router.push(href);
      }}
    />
  ));
}
