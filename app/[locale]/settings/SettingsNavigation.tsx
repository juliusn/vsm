'use client';

import { Anchor, Breadcrumbs, Text, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

type TitleMapKeys = 'settings' | 'update-password' | 'delete-account';

export function SettingsNavigation() {
  const pathname = usePathname();
  const t = useTranslations('Settings');
  const titleMap: Record<TitleMapKeys, string> = {
    settings: t('title'),
    'update-password': t('changePassword'),
    'delete-account': t('deleteAccount'),
  };
  const segments = pathname.split('/').slice(2);
  const isAtSettingsRoot = segments.length === 1 && segments[0] === 'settings';
  const items = segments
    .filter((segment: string): segment is TitleMapKeys => segment in titleMap)
    .map((segment, i) =>
      i === segments.length - 1 ? (
        <Text key={i}>{titleMap[segment]}</Text>
      ) : (
        <Anchor href={`/${segments.slice(0, i + 1).join('/')}`} key={i}>
          {titleMap[segment]}
        </Anchor>
      )
    );

  return isAtSettingsRoot ? (
    <Title size="h4">{t('title')}</Title>
  ) : (
    <Breadcrumbs>{items}</Breadcrumbs>
  );
}
