import { Stack } from '@mantine/core';

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Stack h="100%">{children}</Stack>;
}
