'use client';

import { DeleteConfirmation } from '@/app/components/DeleteConfirmation';
import { DockingPreview } from '@/app/components/DockingPreview';
import {
  useDockingDeletedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { DockingRowData } from '@/lib/types/docking';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDockings } from '@/app/context/DockingContext';

export function DeleteDockingConfirmation({
  data,
  cancel,
  afterConfirm,
}: {
  data: DockingRowData;
  cancel(): void;
  afterConfirm?: () => void;
}) {
  const t = useTranslations('DeleteDockingConfirmation');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { dispatchDockings, dispatchDockingEvents } = useDockings();
  const getErrorNotification = usePostgresErrorNotification();
  const getDockingDeletedNotification = useDockingDeletedNotification();

  return (
    <DeleteConfirmation
      message={t('message')}
      preview={<DockingPreview data={data} />}
      cancel={cancel}
      onConfirm={async () => {
        setLoading(true);

        const { error, status } = await supabase
          .from('dockings')
          .delete()
          .eq('id', data.id);

        setLoading(false);

        if (error) {
          showNotification(getErrorNotification(status));
          return;
        }

        dispatchDockings({ type: 'deleted', id: data.id });
        dispatchDockingEvents({
          type: 'cascade-deleted',
          id: data.id,
          foreignKey: 'docking',
        });
        showNotification(getDockingDeletedNotification());
        close();
        afterConfirm?.();
      }}
      loading={loading}
    />
  );
}
