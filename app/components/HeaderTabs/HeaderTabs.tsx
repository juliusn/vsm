'use client';

import { Tabs } from '@mantine/core';
import classes from './HeaderTabs.module.css';
import { usePathname, useRouter } from 'next-intl/client';
export function HeaderTabs({
  navItems,
}: {
  navItems: { label: string; href: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <Tabs
      value={pathname}
      onChange={(value) => value && router.push(value)}
      variant="outline"
      visibleFrom="xs"
      classNames={{
        list: classes.tabsList,
        tab: classes.tab,
      }}>
      <Tabs.List>
        {navItems.map(({ label, href }) => (
          <Tabs.Tab value={href} key={label}>
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
}
