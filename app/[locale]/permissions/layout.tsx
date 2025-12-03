import { Stack, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('PermissionsLayout');

  return (
    <Stack>
      <Title size="h2">{t('title')}</Title>
      {children}
    </Stack>
  );
}
