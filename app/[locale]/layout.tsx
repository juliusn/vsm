import {
  ColorSchemeScript,
  Container,
  mantineHtmlProps,
  MantineProvider,
} from '@mantine/core';
import '@mantine/core/styles.css';
import { DatesProvider } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import 'mantine-datatable/styles.css';
import 'dayjs/locale/fi';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AuthListener } from '../components/AuthListener';
import { HeaderContent } from '../components/HeaderContent';
import { ProgressBar } from '../components/ProgressBar';
import '../globals.css';

export const metadata: Metadata = {
  title: 'VSM',
  description: 'Vanaheim Service Management',
};

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  const messages = await getMessages();

  return (
    <html lang={locale} {...mantineHtmlProps}>
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
                <Container fluid mb="xs" w="100vw" className="overflow-y-auto">
                  <Container h="100%" w="100%">
                    {children}
                  </Container>
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
