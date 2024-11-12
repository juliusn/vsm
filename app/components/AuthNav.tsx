'use client';

import { usePathname, useRouter } from '@/i18n/routing';
import { Group, Menu, Tabs, UnstyledButton } from '@mantine/core';
import {
  IconChevronDown,
  IconKey,
  IconLogin2,
  IconUserPlus,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { startTransition } from 'react';
import { useProgressBar } from './ProgressBar';

export function AuthNav() {
  const t = useTranslations('AuthNav');
  const router = useRouter();
  const pathname = usePathname();
  const progress = useProgressBar();
  const items = [
    {
      path: '/login',
      icon: IconLogin2,
      label: t('login'),
    },
    {
      path: '/register',
      icon: IconUserPlus,
      label: t('register'),
    },
  ];
  return (
    <Group>
      <Group hiddenFrom="xs">
        <Menu position="bottom-end">
          <Menu.Target>
            <UnstyledButton variant="transparent">
              <Group gap={7}>
                <IconKey size={20} stroke={1} />
                <IconChevronDown size={20} stroke={1} />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            {items.map(({ path, icon: IconComponent, label }, i) => (
              <Menu.Item
                key={i}
                onClick={(event) => {
                  event.preventDefault();
                  progress.start();
                  startTransition(() => {
                    router.push(path);
                    progress.done();
                  });
                }}
                disabled={pathname === path}
                leftSection={<IconComponent size={20} stroke={1} />}>
                {label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
      <Tabs
        value={pathname}
        onChange={(value) => {
          if (value) {
            progress.start();
            startTransition(() => {
              router.push(value);
              progress.done();
            });
          }
        }}
        visibleFrom="xs">
        <Tabs.List>
          {items.map(({ path, label }, i) => {
            return (
              <Tabs.Tab key={i} value={path}>
                {label}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </Tabs>
    </Group>
  );
}
