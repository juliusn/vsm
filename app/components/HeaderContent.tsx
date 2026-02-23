'use client';

import { useAuthStore } from '../store';
import { AuthNav } from './AuthNav';
import { Header } from './Header/Header';
import { LanguageSelect } from './LanguageSelect';
import { LogoVanaheim } from './LogoVanaheim';
import { UserMenu } from './UserMenu/UserMenu';

export function HeaderContent() {
  const user = useAuthStore((store) => store.user);

  return (
    <Header>
      <LanguageSelect />
      <LogoVanaheim className="h-7 fill-gray-900 dark:fill-gray-300 hidden xs:block absolute left-1/2 -translate-x-1/2 top-4 md:top-12" />
      {user ? <UserMenu user={user} /> : <AuthNav />}
    </Header>
  );
}
