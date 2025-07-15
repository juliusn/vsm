'use client';

import { Select, SelectProps, useComputedColorScheme } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function PortAreaInput({ ...others }: SelectProps) {
  const t = useTranslations('PortAreaInput');
  const colorScheme = useComputedColorScheme();

  return (
    <Select
      label={t('portArea')}
      placeholder={t('selectPortArea')}
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
