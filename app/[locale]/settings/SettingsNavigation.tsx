'use client';

import { ProgressBarAnchor } from '@/app/components/ProgressBar';
import { usePathname } from '@/i18n/routing';
import { Breadcrumbs, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

type TitleMapKeys = 'settings' | 'update-password' | 'delete-account';

export function SettingsNavigation() {
  const pathname = usePathname();
  const t = useTranslations('Settings');
  const titleMap: Record<TitleMapKeys, string> = {
    settings: t('settingsMenu'),
    'update-password': t('changePassword'),
    'delete-account': t('deleteAccount'),
  };
  const segments = pathname.split('/').slice(1);
  const items = segments
    .filter((segment: string): segment is TitleMapKeys => segment in titleMap)
    .map((segment, i) =>
      i === segments.length - 1 ? (
        <Text key={i}>{titleMap[segment]}</Text>
      ) : (
        <ProgressBarAnchor
          href={`/${segments.slice(0, i + 1).join('/')}`}
          key={i}>
          {titleMap[segment]}
        </ProgressBarAnchor>
      )
    );

  return <Breadcrumbs>{items}</Breadcrumbs>;
}
