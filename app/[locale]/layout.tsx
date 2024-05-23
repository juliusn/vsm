import '../globals.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { ColorSchemeScript, Container, MantineProvider } from '@mantine/core';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { AuthListener } from '../components/AuthListener';
import { notFound } from 'next/navigation';
import { Notifications } from '@mantine/notifications';
import { HeaderContent } from '../components/HeaderContent';

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
        <NextIntlClientProvider locale={locale} messages={messages}>
          <MantineProvider defaultColorScheme="auto">
            <AuthListener />
            <HeaderContent />
            <Container>{children}</Container>
            <Notifications autoClose={6000} />
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
