'use client';

import {
  Avatar,
  Group,
  LoadingOverlay,
  Menu,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { ReactNode, useState, useTransition } from 'react';
import classes from './UserMenu.module.css';
import cx from 'clsx';
import {
  IconChevronDown,
  IconExclamationMark,
  IconLogout,
  IconSettings,
  IconUserCheck,
  IconUserCircle,
} from '@tabler/icons-react';
import { useSessionStore } from '@/app/store';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/navigation';
import { createClient } from '@/lib/supabase/client';
type MenuItem = { label: string; icon: ReactNode; handler: () => void };

export function UserMenu() {
  const t = useTranslations('UserMenu');
  const supabase = createClient();
  const session = useSessionStore((store) => store.session);
  const router = useRouter();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [isPending, startTransition] = useTransition();
  const items: MenuItem[] = [
    {
      label: t('settings'),
      icon: (
        <IconSettings
          style={{ width: rem(16), height: rem(16) }}
          stroke={1.5}
        />
      ),
      handler: () => {
        startTransition(() => {
          router.push('/settings');
        });
      },
    },
    {
      label: t('profile'),
      icon: (
        <IconUserCircle
          style={{ width: rem(16), height: rem(16) }}
          stroke={1.5}
        />
      ),
      handler: () => {
        startTransition(() => {
          router.push('/profile');
        });
      },
    },
    {
      label: t('roles'),
      icon: (
        <IconUserCheck
          style={{ width: rem(16), height: rem(16) }}
          stroke={1.5}
        />
      ),
      handler: () => {
        startTransition(() => {
          router.push('/roles');
        });
      },
    },
    {
      label: t('logout'),
      icon: (
        <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      ),
      handler: () => {
        startTransition(async () => {
          const { error } = await supabase.auth.signOut();
          if (!error) {
            router.push('/login');
          } else {
            showNotification({
              title: t('error'),
              message: t('logoutError'),
              icon: <IconExclamationMark stroke={1.5} />,
              color: 'red',
            });
          }
        });
      },
    },
  ];

  return (
    <Menu
      position="bottom-end"
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      disabled={isPending}
      withinPortal>
      <LoadingOverlay visible={isPending} />
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, {
            [classes.userActive]: userMenuOpened,
          })}>
          <Group gap={7}>
            <Avatar
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
              alt={`${session?.user.user_metadata.user_name}`}
              radius="xl"
              size={20}
            />
            <Text fw={500} size="sm" lh={1} mr={3}>
              <span className="hidden sm:inline">
                {session?.user.user_metadata.user_name}
              </span>
              <span className="sm:hidden">
                {session?.user.user_metadata.user_name.split(' ')[0]}
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
        <Menu.Label>{t('account')}</Menu.Label>
        {items.map(({ handler, icon, label }, i) => (
          <Menu.Item key={i} onClick={handler} leftSection={icon}>
            {label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
