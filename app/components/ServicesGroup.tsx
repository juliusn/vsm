'use client';

import { WithDictionary } from '@/lib/types/translation';
import { Badge, Group } from '@mantine/core';
import { useLocale } from 'next-intl';
import { SortableCommonService } from '../context/CommonServiceContext';

export default function ServicesGroup({
  services,
}: {
  services: WithDictionary<SortableCommonService>[];
}) {
  const locale = useLocale();

  return (
    <Group gap={4} wrap="nowrap">
      {services
        .toSorted((a, b) => a.sort_order - b.sort_order)
        .map((service) => (
          <Badge
            key={service.id}
            variant="default"
            styles={{ root: { flexShrink: 0 } }}>
            {service.dictionary[locale].abbreviation}
          </Badge>
        ))}
    </Group>
  );
}
