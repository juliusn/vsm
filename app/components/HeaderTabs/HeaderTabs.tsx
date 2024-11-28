'use client';

import { Tabs } from '@mantine/core';
import classes from './HeaderTabs.module.css';
import { usePathname, useRouter } from '@/i18n/routing';
import { startTransition, useEffect, useState } from 'react';
import { useProgressBar } from '../ProgressBar';

export function HeaderTabs({
  navItems,
}: {
  navItems: { label: string; href: string }[];
}) {
  const router = useRouter();
  const progress = useProgressBar();
  const pathname = usePathname();
  const current = `/${pathname.split('/')[1]}`;
  const [activeTab, setActiveTab] = useState<string | null>(current);

  useEffect(() => {
    setActiveTab(current);
  }, [current]);

  return (
    <Tabs
      value={activeTab}
      onChange={(value) => {
        if (value) {
          setActiveTab(value);
          progress.start();
          startTransition(() => {
            router.push(value);
            progress.done();
          });
        }
      }}
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
