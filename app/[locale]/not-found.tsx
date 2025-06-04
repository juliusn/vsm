'use client';

import { usePathname } from '@/i18n/routing';
import { Code, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');
  const pathname = usePathname();
  return (
    <>
      <Title size="h2" ta="center">
        404
      </Title>
      <Text ta="center">
        {t.rich('message', { code: () => <Code>{pathname}</Code> })}
      </Text>
    </>
  );
}
