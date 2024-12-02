import { Stack } from '@mantine/core';
import { NewOrderContent } from './NewOrderContent';

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack>
      <NewOrderContent />
      {children}
    </Stack>
  );
}
