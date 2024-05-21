'use client';

import { Container, AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { HeaderTopShelf } from '../HeaderTopShelf';
import { HeaderTabs } from '../HeaderTabs/HeaderTabs';
import { HeaderNavbarLinks } from '../HeaderNavbarLinks';
import classes from './Header.module.css';
import { useTranslations } from 'next-intl';

export function Header({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Header');
  const [opened, { toggle }] = useDisclosure(false);
  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('orders'), href: '/orders' },
    { label: t('messages'), href: '/messages' },
  ];

  return (
    <AppShell
      className={classes.header}
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
  );
}
