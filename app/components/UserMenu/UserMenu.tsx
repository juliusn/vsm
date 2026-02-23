'use client';

import { AuthUser } from '@/app/store';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { Avatar, Group, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  IconCheck,
  IconChevronDown,
  IconExclamationMark,
  IconLogout,
  IconSettings,
  IconUserCheck,
  IconUserCircle,
} from '@tabler/icons-react';
import cx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactNode, startTransition, useState } from 'react';
import { useProgressBar } from '../ProgressBar';
import classes from './UserMenu.module.css';
type MenuItem = { label: string; icon: ReactNode; handler: () => void };

export function UserMenu({ user }: { user: AuthUser }) {
  const t = useTranslations('UserMenu');
  const supabase = createClient();
  const router = useRouter();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const progress = useProgressBar();
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
        progress.start();
        startTransition(() => {
          router.push('/settings');
          progress.done();
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
        progress.start();
        startTransition(() => {
          router.push('/profile');
          progress.done();
        });
      },
    },
    {
      label: t('permissions'),
      icon: (
        <IconUserCheck
          style={{ width: rem(16), height: rem(16) }}
          stroke={1.5}
        />
      ),
      handler: () => {
        progress.start();
        startTransition(() => {
          router.push('/permissions');
          progress.done();
        });
      },
    },
    {
      label: t('logout'),
      icon: (
        <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      ),
      handler: () => {
        progress.start();
        startTransition(async () => {
          const { error } = await supabase.auth.signOut();
          if (!error) {
            showNotification({
              title: t('logoutTitle'),
              message: t('logoutMessage'),
              icon: <IconCheck stroke={1.5} />,
              color: 'green',
            });
            startTransition(() => {
              router.push('/login');
              progress.done();
            });
          } else if (error.status === 403) {
            progress.done();
          } else {
            progress.done();
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
      withinPortal>
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, {
            [classes.userActive]: userMenuOpened,
          })}>
          <Group gap={7}>
            <Avatar
              src="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80"
              alt={`${user.userMetadata.first_name}`}
              radius="xl"
              size={20}
            />
            <Text fw={500} size="sm" lh={1} mr={3}>
              {user.userMetadata.first_name}
              <span className="hidden sm:inline">
                {' '}
                {user.userMetadata.last_name}
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
