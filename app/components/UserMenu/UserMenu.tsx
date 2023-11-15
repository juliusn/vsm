'use client';

import { Avatar, Group, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import { useState, useTransition } from 'react';
import classes from './UserMenu.module.css';
import cx from 'clsx';
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUserCheck,
  IconUserCircle,
} from '@tabler/icons-react';
import { useRouter } from 'next-intl/client';
import { useProfileStore } from '@/app/store';
import { logout } from '@/app/actions';

export function UserMenu({
  labelAccount,
  labelSettings,
  labelProfile,
  labelRoles,
  labelLogout,
}: {
  labelAccount: string;
  labelSettings: string;
  labelProfile: string;
  labelRoles: string;
  labelLogout: string;
}) {
  const profile = useProfileStore((store) => store.profile);
  const setProfile = useProfileStore((store) => store.setProfile);
  const router = useRouter();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [isPending, startTransition] = useTransition();
  const items = [
    {
      handler: () => {
        startTransition(() => router.push('/settings'));
      },
      icon: (
        <IconSettings
          style={{ width: rem(16), height: rem(16) }}
          stroke={1.5}
        />
      ),
      label: labelSettings,
    },
    {
      handler: () => {
        startTransition(() => router.push('/profile'));
      },
      icon: (
        <IconUserCircle
          style={{ width: rem(16), height: rem(16) }}
          stroke={1.5}
        />
      ),
      label: labelProfile,
    },
    {
      handler: () => {
        startTransition(() => {
          router.push('/roles');
        });
      },
      icon: (
        <IconUserCheck
          style={{ width: rem(16), height: rem(16) }}
          stroke={1.5}
        />
      ),
      label: labelRoles,
    },
    {
      handler: () => {
        startTransition(async () => {
          const { error } = await logout();
          if (!error) {
            setProfile(null);
            router.push('/login');
            router.refresh();
          }
        });
      },
      icon: (
        <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      ),
      label: labelLogout,
    },
  ];
  return (
    <Menu
      position="bottom-end"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      disabled={isPending}
      withinPortal>
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, {
            [classes.userActive]: userMenuOpened,
          })}>
          <Group gap={7}>
            <Avatar
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
              alt={`${profile?.user_name}`}
              radius="xl"
              size={20}
            />
            <Text fw={500} size="sm" lh={1} mr={3}>
              <span className="hidden sm:inline">{profile?.user_name}</span>
              <span className="sm:hidden">
                {profile?.user_name.split(' ')[0]}
              </span>
            </Text>
            <IconChevronDown
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>{labelAccount}</Menu.Label>
        {items.map(({ handler, icon, label }, i) => (
          <Menu.Item key={i} onClick={handler} leftSection={icon}>
            {label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
