'use client';

import { Select, SelectProps, useComputedColorScheme } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function BerthInput({ ...others }: SelectProps) {
  const t = useTranslations('BerthInput');
  const colorScheme = useComputedColorScheme();

  return (
    <Select
      label={t('berth')}
      placeholder={t('selectBerth')}
      searchable
      clearable
      styles={(theme) => ({
        groupLabel: {
          position: 'sticky',
          top: 0,
          zIndex: 1,
          boxShadow: theme.shadows.xs,
          backgroundColor:
            colorScheme === 'light' ? theme.white : theme.colors.dark[6],
        },
      })}
      {...others}
    />
  );
}
