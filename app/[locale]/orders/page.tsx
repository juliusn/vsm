import { Container, Group, Stack, Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { NewOrder } from './NewOrder';

export default function OrdersPage() {
  const t = useTranslations('Orders');
  return (
    <>
      <Container>
        <Stack>
          <Group justify="space-between">
            <Title size="h4">{t('title')}</Title>
            <NewOrder />
          </Group>
        </Stack>
      </Container>
    </>
  );
}
