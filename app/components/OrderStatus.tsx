'use client';

import { Badge, BadgeProps } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function OrderStatus({ status }: { status: AppTypes.OrderStatus }) {
  const t = useTranslations('OrderStatus');

  switch (status) {
    case 'submitted':
      return <ExpandableBadge color="yellow">{t('submitted')}</ExpandableBadge>;
    case 'received':
      return <ExpandableBadge color="blue">{t('received')}</ExpandableBadge>;
    case 'completed':
      return <ExpandableBadge color="green">{t('completed')}</ExpandableBadge>;
    case 'cancelled':
      return <ExpandableBadge color="gray">{t('cancelled')}</ExpandableBadge>;
  }
}

function ExpandableBadge(props: BadgeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Badge
      {...props}
      style={{ cursor: 'pointer' }}
      fullWidth={expanded}
      onClick={() => setExpanded((expanded) => !expanded)}
    />
  );
}
