import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import '../globals.css';
import '@mantine/core/styles.css';
import { Metadata } from 'next';
import { Header } from '@/app/components/Header/Header';
import { NextIntlClientProvider, useTranslations } from 'next-intl';
import { UserMenu } from '../components/UserMenu/UserMenu';
import { User } from '@supabase/auth-helpers-nextjs';
import { LanguageSelect } from '../components/LanguageSelect';
import { LogoVanaheim } from '../components/LogoVanaheim';
import { AuthNav } from '../components/AuthNav';
import { ProfileStoreAdapter } from '../components/ProfileStoreAdapter';
import { Modals } from '../components/Modals';
import { getProfile, getUser } from '../actions';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'VSM',
  description: 'Vanaheim Service Management',
};

const locales = ['en', 'fi'];

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const isValidLocale = locales.some((cur) => cur === locale);
  if (!isValidLocale) {
    notFound();
  }
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  const user = await getUser();
  const profile = user ? await getProfile(user) : null;

  return (
    <html>
      <ProfileStoreAdapter profile={profile} />
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <title>VSM</title>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MantineProvider defaultColorScheme="auto">
            <HeaderContent user={user} />
            <Container>{children}</Container>
            <ModalsContent />
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

function HeaderContent({ user }: { user: User | null }) {
  const t = useTranslations('Header');
  return (
    <Header
      labelHome={t('home')}
      labelOrders={t('orders')}
      labelMessages={t('messages')}>
      <LanguageSelect />
      <LogoVanaheim className="h-7 fill-gray-900 dark:fill-gray-300 hidden xs:block absolute left-1/2 -translate-x-1/2 top-4 md:top-12" />
      {user ? <UserMenuContent /> : <AuthNavContent />}
    </Header>
  );
}

function UserMenuContent() {
  const t = useTranslations('UserMenu');
  return (
    <UserMenu
      labelAccount={t('account')}
      labelSettings={t('settings')}
      labelProfile={t('profile')}
      labelRoles={t('roles')}
      labelLogout={t('logout')}
    />
  );
}

function AuthNavContent() {
  const t = useTranslations('AuthNav');
  return (
    <AuthNav
      labelLoginButton={t('login')}
      labelRegisterButton={t('register')}
    />
  );
}

function ModalsContent() {
  const t = useTranslations('Modals');
  return (
    <Modals titleMessage={t('titleMessage')} titleError={t('titleError')} />
  );
}
