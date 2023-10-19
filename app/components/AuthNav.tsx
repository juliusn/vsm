'use client';

import { Group, Menu, Tabs, UnstyledButton } from '@mantine/core';
import {
  IconChevronDown,
  IconKey,
  IconLogin2,
  IconUserPlus,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next-intl/client';

export function AuthNav({
  labelLoginButton,
  labelRegisterButton,
}: {
  labelLoginButton: string;
  labelRegisterButton: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const items = [
    {
      path: '/login',
      icon: <IconLogin2 size={20} stroke={1} />,
      label: labelLoginButton,
    },
    {
      path: '/register',
      icon: <IconUserPlus size={20} stroke={1} />,
      label: labelRegisterButton,
    },
  ];
  return (
    <>
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
              {items.map(({ path, icon, label }, i) => {
                return (
                  <Menu.Item
                    key={i}
                    onClick={() => router.push(path)}
                    disabled={pathname === path}
                    leftSection={icon}>
                    {label}
                  </Menu.Item>
                );
              })}
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Tabs
          value={pathname}
          onChange={(value) => value && router.push(value)}
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
    </>
  );
}
