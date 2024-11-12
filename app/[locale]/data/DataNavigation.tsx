'use client';

import { ProgressBarAnchor } from '@/app/components/ProgressBar';
import { usePathname } from '@/i18n/routing';
import { Breadcrumbs, Text } from '@mantine/core';
import { useTranslations } from 'next-intl';

type TitleMapKeys = 'data' | 'ports' | 'vessels';

export function DataNavigation() {
  const pathname = usePathname();
  const t = useTranslations('Data');
  const titleMap: Record<TitleMapKeys, string> = {
    data: t('dataMenu'),
    ports: t('portsAndBerths'),
    vessels: t('vessels'),
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
