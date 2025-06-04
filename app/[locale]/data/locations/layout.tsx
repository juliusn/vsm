import { LocationProvider } from '@/app/context/LocationContext';
import { fetchLocations } from '@/lib/fetchLocations';
import { Stack } from '@mantine/core';
import { LocationBreadcrumbs } from './LocationBreadcrumbs';
import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';

export default async function LocationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await fetchLocations();

  return data ? (
    <Stack>
      <LocationBreadcrumbs />
      <LocationProvider initialState={data}>{children}</LocationProvider>
    </Stack>
  ) : (
    <DataUnavailableAlert />
  );
}
