'use client';

import { Header } from './Header/Header';
import { LanguageSelect } from './LanguageSelect';
import { LogoVanaheim } from './LogoVanaheim';
import { useSessionStore } from '../store';
import { UserMenu } from './UserMenu/UserMenu';
import { AuthNav } from './AuthNav';

export function HeaderContent() {
  const profile = useSessionStore((store) => store.session);
  return (
    <Header>
      <LanguageSelect />
      <LogoVanaheim className="h-7 fill-gray-900 dark:fill-gray-300 hidden xs:block absolute left-1/2 -translate-x-1/2 top-4 md:top-12" />
      {profile ? <UserMenu /> : <AuthNav />}
    </Header>
  );
}
