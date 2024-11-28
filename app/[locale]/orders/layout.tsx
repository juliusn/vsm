import { Group, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('OrdersLayout');

  return (
    <Stack>
      <Group justify="space-between">
        <Title size="h4">{t('title')}</Title>
        {children}
      </Group>
    </Stack>
  );
}
