'use client';

import { useErrorNotification } from '@/app/hooks/notifications';
import { useDockingsStore } from '@/app/store';
import { createClient } from '@/lib/supabase/client';
import { showNotification } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { DockingsTable } from './DockingsTable';

export function DockingsTableContainer() {
  const supabase = createClient();
  const { dockings, setDockings, dockingEvents, setDockingEvents } =
    useDockingsStore();
  const [loading, setLoading] = useState(true);
  const getErrorNotification = useErrorNotification();

  useEffect(() => {
    const fetchData = async () => {
      const responses = await Promise.all([
        supabase
          .from('dockings')
          .select()
          .order('created_at', { ascending: false }),
        supabase.from('docking_events').select(),
      ]);

      const [
        { data: dockings, error: dockingsError, status: dockingsStatus },
        {
          data: dockingEvents,
          error: dockingEventsError,
          status: dockingEventsStatus,
        },
      ] = responses;

      if (dockingsError) {
        showNotification(getErrorNotification(dockingsStatus));
        setLoading(false);
        return;
      }

      if (dockingEventsError) {
        showNotification(getErrorNotification(dockingEventsStatus));
        setLoading(false);
        return;
      }

      setDockings(dockings);
      setDockingEvents(dockingEvents);
      setLoading(false);
    };

    fetchData();
  }, [supabase, getErrorNotification, setDockings, setDockingEvents]);

  return (
    <DockingsTable
      dockings={dockings}
      dockingEvents={dockingEvents}
      loading={loading}
    />
  );
}
