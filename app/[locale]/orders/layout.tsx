import { Group, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('Orders');

  return (
    <Stack>
      <Group justify="space-between">
        <Title size="h4">{t('ordersTitle')}</Title>
        {children}
      </Group>
    </Stack>
  );
}
