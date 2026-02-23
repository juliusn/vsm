'use client';

import { AppShell, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { HeaderNavbarLinks } from '../HeaderNavbarLinks';
import { HeaderTabs } from '../HeaderTabs/HeaderTabs';
import { HeaderTopShelf } from '../HeaderTopShelf';
import classes from './Header.module.css';
import { useAuthStore } from '@/app/store';

export function Header({ children }: { children: React.ReactNode }) {
  const t = useTranslations('Header');
  const [opened, { toggle }] = useDisclosure(false);
  const { user } = useAuthStore();

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('portTraffic'), href: '/port-traffic' },
    { label: t('orders'), href: '/orders' },
    { label: t('data'), href: '/data' },
    { label: t('admin'), href: '/admin' },
  ].filter((item) => item.href !== '/admin' || user?.admin);

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
