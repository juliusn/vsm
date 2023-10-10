'use client';

import { ActionIcon, Button, Group, Menu } from '@mantine/core';
import { IconKey, IconLogin2, IconUserPlus } from '@tabler/icons-react';
import { usePathname, useRouter } from 'next-intl/client';

export function HeaderLoginContent({
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
              <ActionIcon variant="outline">
                <IconKey />
              </ActionIcon>
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
        <Group gap={8} visibleFrom="xs" hiddenFrom="md">
          {items.map(({ path, label }, i) => {
            return (
              <Button
                key={i}
                onClick={() => router.push(path)}
                disabled={pathname === path}
                size="xs"
                variant="outline">
                {label}
              </Button>
            );
          })}
        </Group>
        <Group visibleFrom="md">
          {items.map(({ path, label }, i) => {
            return (
              <Button
                key={i}
                onClick={() => router.push(path)}
                disabled={pathname === path}
                variant="outline">
                {label}
              </Button>
            );
          })}
        </Group>
      </Group>
    </>
  );
}
