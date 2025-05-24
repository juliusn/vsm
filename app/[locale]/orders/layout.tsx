import { Stack } from '@mantine/core';
import { NewOrderContent } from './NewOrderContent';
import { createClient } from '@/lib/supabase/server';
import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { DockingProvider } from './DockingContext';

export default async function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const dockingsQuery = supabase.from('dockings').select('*');
  const dockingEventsQuery = supabase.from('docking_events').select('*');
  const [dockingsResponse, dockingEventsResponse] = await Promise.all([
    dockingsQuery,
    dockingEventsQuery,
  ]);

  return dockingsResponse.data && dockingEventsResponse.data ? (
    <DockingProvider
      dockings={dockingsResponse.data}
      dockingEvents={dockingEventsResponse.data}>
      <Stack>
        <NewOrderContent />
        {children}
      </Stack>
    </DockingProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
