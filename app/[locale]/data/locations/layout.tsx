import { Stack } from '@mantine/core';
import { LocationsBreadcrumbs } from './LocationsBreadcrumbs';

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack>
      <LocationsBreadcrumbs />
      {children}
    </Stack>
  );
}
