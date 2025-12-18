import { Order } from '@/lib/types/query-types';
import { Badge, BadgeProps } from '@mantine/core';
import { useTranslations } from 'next-intl';

export function OrderStatus({ status }: { status: Order['status'] }) {
  const t = useTranslations('OrderStatusSelect');

  switch (status) {
    case 'submitted':
      return <FullWidthBadge color="yellow">{t('submitted')}</FullWidthBadge>;
    case 'received':
      return <FullWidthBadge color="blue">{t('received')}</FullWidthBadge>;
    case 'completed':
      return <FullWidthBadge color="green">{t('completed')}</FullWidthBadge>;
    case 'canceled':
      return <FullWidthBadge color="gray">{t('canceled')}</FullWidthBadge>;
  }
}

function FullWidthBadge(props: BadgeProps) {
  return (
    <Badge
      {...props}
      style={{
        cursor: 'pointer',
        width: '100%',
        minWidth: 'max-content',
      }}
    />
  );
}
