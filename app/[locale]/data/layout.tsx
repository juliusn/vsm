import { Stack } from '@mantine/core';
import { DataNavigation } from './DataNavigation';

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack h="100%">
      <DataNavigation />
      {children}
    </Stack>
  );
}
