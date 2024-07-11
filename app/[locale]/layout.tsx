import '../globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { Notifications } from '@mantine/notifications';
import { HeaderContent } from '../components/HeaderContent';
import { AuthListener } from '../components/AuthListener';
import { getMessages } from 'next-intl/server';
import { ProgressBar } from '../components/ProgressBar';

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
      <body>
        <NextIntlClientProvider messages={messages}>
          <MantineProvider defaultColorScheme="auto">
            <AuthListener />

            <ProgressBar className="fixed top-0 h-1 bg-sky-500">
              <HeaderContent />
              <Container>{children}</Container>
            </ProgressBar>
            <Notifications autoClose={6000} />
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
