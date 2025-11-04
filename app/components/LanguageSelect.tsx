'use client';

import { Select } from '@mantine/core';
import { hasLocale, useLocale } from 'next-intl';
import { routing, usePathname, useRouter } from '@/i18n/routing';
import { useProgressBar } from './ProgressBar';
import { startTransition } from 'react';

export function LanguageSelect() {
  const locale = useLocale();
  const router = useRouter();
  const pathName = usePathname();
  const progress = useProgressBar();

  return (
    <Select
      size="xs"
      defaultValue={locale}
      onChange={(value) => {
        if (hasLocale(routing.locales, value)) {
          progress.start();
          startTransition(() => {
            router.push(pathName, { locale: value });
            progress.done();
          });
        }
      }}
      allowDeselect={false}
      className="w-20"
      styles={{
        option: {
          whiteSpace: 'nowrap',
        },
      }}
      data={[
        { label: '🇬🇧 En', value: 'en' },
        { label: '🇫🇮 Fi', value: 'fi' },
      ]}
    />
  );
}
