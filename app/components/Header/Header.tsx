'use client';

import { Container, AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { HeaderTopShelf } from '../HeaderTopShelf';
import { HeaderTabs } from '../HeaderTabs/HeaderTabs';
import { HeaderNavbarLinks } from '../HeaderNavbarLinks';
import classes from './Header.module.css';

export function Header({
  children,
  labelHome,
  labelOrders,
  labelMessages,
}: {
  children: React.ReactNode;
  labelHome: string;
  labelOrders: string;
  labelMessages: string;
}) {
  const [opened, { toggle }] = useDisclosure(false);
  const navItems = [
    { label: labelHome, href: '/' },
    { label: labelOrders, href: '/orders' },
    { label: labelMessages, href: '/messages' },
  ];
  return (
    <div className={classes.header}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'xs',
          collapsed: { desktop: true, mobile: !opened },
        }}>
        <Container className={classes.mainSection} size="md">
          <HeaderTopShelf opened={opened} toggle={toggle}>
            {children}
          </HeaderTopShelf>
        </Container>
        <Container size="md">
          <HeaderTabs navItems={navItems} />
        </Container>
        <AppShell.Navbar py="md" px={4}>
          <HeaderNavbarLinks navItems={navItems} toggle={toggle} />
        </AppShell.Navbar>
      </AppShell>
    </div>
  );
}
