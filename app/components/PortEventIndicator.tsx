'use client';

import { Enums } from '@/lib/types/database.types';
import { Group, Text } from '@mantine/core';
import {
  IconArrowBarRight,
  IconArrowBarToRight,
  IconArrowsHorizontal,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

const ICONS = {
  arrival: <IconArrowBarToRight color="var(--mantine-color-green-5)" />,
  departure: <IconArrowBarRight color="var(--mantine-color-red-5)" />,
  shifting: <IconArrowsHorizontal color="var(--mantine-color-blue-5)" />,
} satisfies Record<Enums<'port_event'>, React.ReactNode>;

export default function PortEventIndicator({
  type,
  berth,
}: {
  type: Enums<'port_event'>;
  berth?: string | null;
}) {
  const t = useTranslations('PortEventIndicator');
  const label = berth ? `${t(type)} ${berth}` : t(type);

  return (
    <Group wrap="nowrap">
      {ICONS[type]}
      <Text>{label}</Text>
    </Group>
  );
}
