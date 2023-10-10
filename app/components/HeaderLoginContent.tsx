'use client';

import { ActionIcon, Button, Group, Menu } from '@mantine/core';
import { IconKey, IconLogin2, IconUserPlus } from '@tabler/icons-react';
import { useRouter } from 'next-intl/client';

export function HeaderLoginContent({
  labelLoginButton,
  labelRegisterButton,
}: {
  labelLoginButton: string;
  labelRegisterButton: string;
}) {
  const router = useRouter();
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
              <Menu.Item
                onClick={() => router.push('/login')}
                leftSection={<IconLogin2 size={20} stroke={1} />}>
                {labelLoginButton}
              </Menu.Item>
              <Menu.Item
                onClick={() => router.push('/register')}
                leftSection={<IconUserPlus size={20} stroke={1} />}>
                {labelRegisterButton}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Group gap={8} visibleFrom="xs" hiddenFrom="md">
          <Button
            onClick={() => router.push('/login')}
            size="xs"
            variant="outline">
            {labelLoginButton}
          </Button>
          <Button
            onClick={() => router.push('/register')}
            size="xs"
            variant="outline">
            {labelRegisterButton}
          </Button>
        </Group>
        <Group visibleFrom="md">
          <Button
            onClick={() => router.push('/login')}
            visibleFrom="xs"
            variant="outline">
            {labelLoginButton}
          </Button>
          <Button
            onClick={() => router.push('/register')}
            visibleFrom="xs"
            variant="outline">
            {labelRegisterButton}
          </Button>
        </Group>
      </Group>
    </>
  );
}
