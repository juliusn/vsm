import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import '../globals.css';
import '@mantine/core/styles.css';
import { Metadata } from 'next';
import { Header } from '@/app/components/Header/Header';
import { useTranslations } from 'next-intl';
import { HeaderUserMenu } from '../components/HeaderUserMenu/HeaderUserMenu';
import {
  Session,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/database.types';
import { cookies } from 'next/headers';
import { LanguageSelect } from '../components/LanguageSelect';
import { LogoVanaheim } from '../components/LogoVanaheim';
import { HeaderLoginContent } from '../components/HeaderLoginContent';

export const metadata: Metadata = {
  title: 'VSM',
  description: 'Vanaheim Service Management',
};

const profile = {
  userName: 'Julius Niiniranta',
  email: 'julius@niiniranta.net',
  image:
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=255&q=80',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html>
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
        <MantineProvider defaultColorScheme="auto">
          <RootLayoutContent session={session} />
          <Container>{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}

function RootLayoutContent({ session }: { session: Session | null }) {
  const translationsHeader = useTranslations('Header');
  const translationsMenu = useTranslations('HeaderUserMenu');
  const translationsHeaderLoginContent = useTranslations('HeaderLoginContent');
  return (
    <Header
      labelHome={translationsHeader('home')}
      labelOrders={translationsHeader('orders')}
      labelMessages={translationsHeader('messages')}>
      <LanguageSelect />
      <LogoVanaheim className="h-7 fill-gray-900 dark:fill-gray-300 hidden xs:block absolute left-1/2 -translate-x-1/2 top-4 md:top-12" />
      {session?.user ? (
        <HeaderUserMenu
          profile={profile}
          labelAccount={translationsMenu('account')}
          labelSettings={translationsMenu('settings')}
          labelProfile={translationsMenu('profile')}
          labelRoles={translationsMenu('roles')}
          labelLogout={translationsMenu('logout')}
        />
      ) : (
        <HeaderLoginContent
          loginButtonLabel={translationsHeaderLoginContent('login')}
          registerButtonLabel={translationsHeaderLoginContent('register')}
        />
      )}
    </Header>
  );
}
