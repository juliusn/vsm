import { Stack } from '@mantine/core';
import { LocationBreadcrumbs } from './LocationBreadcrumbs';

export default function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Stack>
      <LocationBreadcrumbs />
      {children}
    </Stack>
  );
}
