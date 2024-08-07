import '../globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import 'dayjs/locale/fi';
import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Notifications } from '@mantine/notifications';
import { HeaderContent } from '../components/HeaderContent';
import { AuthListener } from '../components/AuthListener';
import { getMessages } from 'next-intl/server';
import { ProgressBar } from '../components/ProgressBar';
import { DatesProvider } from '@mantine/dates';

export const metadata: Metadata = {
  title: 'VSM',
  description: 'Vanaheim Service Management',
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <title>VSM</title>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body className="h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <MantineProvider defaultColorScheme="auto">
            <DatesProvider
              settings={{
                locale,
              }}>
              <AuthListener />
              <ProgressBar className="fixed top-0 h-1 bg-sky-500">
                <HeaderContent />
                <Container mb="xs" h="100%">
                  {children}
                </Container>
              </ProgressBar>
              <Notifications autoClose={6000} />
            </DatesProvider>
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
