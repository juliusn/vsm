'use client';
import { Avatar, Group, Menu, Text, UnstyledButton, rem } from '@mantine/core';
import { useState } from 'react';
import classes from './HeaderUserMenu.module.css';
import cx from 'clsx';
import {
  IconChevronDown,
  IconLogout,
  IconSettings,
  IconUserCheck,
  IconUserCircle,
} from '@tabler/icons-react';
import { useRouter } from 'next-intl/client';

export function HeaderUserMenu({
  profile: { userName, image },
  labelAccount,
  labelSettings,
  labelProfile,
  labelRoles,
  labelLogout,
}: {
  profile: {
    userName: string;
    image: string;
  };
  labelAccount: string;
  labelSettings: string;
  labelProfile: string;
  labelRoles: string;
  labelLogout: string;
}) {
  const router = useRouter();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  return (
    <div>
      <Menu
        position="bottom-end"
        transitionProps={{ transition: 'pop-top-right' }}
        onClose={() => setUserMenuOpened(false)}
        onOpen={() => setUserMenuOpened(true)}
        withinPortal>
        <Menu.Target>
          <UnstyledButton
            className={cx(classes.user, {
              [classes.userActive]: userMenuOpened,
            })}>
            <Group gap={7}>
              <Avatar src={image} alt={`${userName}`} radius="xl" size={20} />
              <Text fw={500} size="sm" lh={1} mr={3}>
                <span className="hidden sm:inline">{userName}</span>
                <span className="sm:hidden">{userName.split(' ')[0]}</span>
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
          <Menu.Item
            onClick={() => router.push('/settings')}
            leftSection={
              <IconSettings
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }>
            {labelSettings}
          </Menu.Item>
          <Menu.Item
            onClick={() => router.push('/profile')}
            leftSection={
              <IconUserCircle
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }>
            {labelProfile}
          </Menu.Item>
          <Menu.Item
            onClick={() => router.push('/roles')}
            leftSection={
              <IconUserCheck
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }>
            {labelRoles}
          </Menu.Item>
          <Menu.Item
            leftSection={
              <IconLogout
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }>
            {labelLogout}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
