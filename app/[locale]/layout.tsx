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
import { ProfileStoreInitializer } from '../components/ProfileStoreInitializer';
import { Modals } from '../components/Modals';

export const metadata: Metadata = {
  title: 'VSM',
  description: 'Vanaheim Service Management',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, profile } = await initializeSessionAndProfile();

  return (
    <html>
      <ProfileStoreInitializer profile={profile} />
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

  async function initializeSessionAndProfile() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return { session, profile: null };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select()
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      throw profileError;
    }

    return { session, profile };
  }
}

function RootLayoutContent({ session }: { session: Session | null }) {
  const translationsHeader = useTranslations('Header');
  const translationsMenu = useTranslations('HeaderUserMenu');
  const translationsHeaderLoginContent = useTranslations('HeaderLoginContent');
  return (
    <>
      <Header
        labelHome={translationsHeader('home')}
        labelOrders={translationsHeader('orders')}
        labelMessages={translationsHeader('messages')}>
        <LanguageSelect />
        <LogoVanaheim className="h-7 fill-gray-900 dark:fill-gray-300 hidden xs:block absolute left-1/2 -translate-x-1/2 top-4 md:top-12" />
        {session?.user ? (
          <HeaderUserMenu
            labelAccount={translationsMenu('account')}
            labelSettings={translationsMenu('settings')}
            labelProfile={translationsMenu('profile')}
            labelRoles={translationsMenu('roles')}
            labelLogout={translationsMenu('logout')}
          />
        ) : (
          <HeaderLoginContent
            labelLoginButton={translationsHeaderLoginContent('login')}
            labelRegisterButton={translationsHeaderLoginContent('register')}
          />
        )}
      </Header>
      <ModalsContent />
    </>
  );
}

function ModalsContent() {
  const t = useTranslations('Modals');
  return (
    <Modals titleMessage={t('titleMessage')} titleError={t('titleError')} />
  );
}
