'use client';

import { ProgressBarAnchor } from '@/app/components/ProgressBar';
import { usePathname } from '@/i18n/routing';
import { Breadcrumbs } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function LocationBreadcrumbs() {
  const pathname = usePathname();
  const t = useTranslations('LocationBreadCrumbs');
  const segments = pathname.split('/').slice(1);
  const currentIndex = pathname.split('/').length - 1;
  const items = [
    t('dataMenu'),
    t('locations'),
    t('portAreas'),
    t('berths'),
    t('services'),
  ]
    .slice(0, currentIndex)
    .map((title, index) => (
      <ProgressBarAnchor
        href={`/${segments.slice(0, index + 1).join('/')}`}
        key={index}>
        {title}
      </ProgressBarAnchor>
    ));
  return <Breadcrumbs>{items}</Breadcrumbs>;
}
