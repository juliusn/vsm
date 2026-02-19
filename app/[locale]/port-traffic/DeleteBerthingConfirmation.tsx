'use client';

import { BerthingPreview } from '@/app/components/BerthingPreview';
import { DeleteConfirmation } from '@/app/components/DeleteConfirmation';
import { useBerthings } from '@/app/context/BerthingContext';
import {
  useBerthingDeletedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { Berthing } from '@/lib/types/query-types';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function DeleteBerthingConfirmation({
  data,
  cancel,
  afterConfirm,
}: {
  data: Berthing;
  cancel(): void;
  afterConfirm?(): void;
}) {
  const t = useTranslations('DeleteBerthingConfirmation');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { dispatchBerthings } = useBerthings();
  const getErrorNotification = usePostgresErrorNotification();
  const getBerthingDeletedNotification = useBerthingDeletedNotification();
  const onConfirm = async () => {
    setLoading(true);

    const portEventsIds = [data.arrival?.id, data.departure?.id].filter(
      (value): value is string => value !== undefined
    );

    if (portEventsIds.length) {
      const portEventsResponse = await supabase
        .from('port_events')
        .delete()
        .in('id', portEventsIds);

      if (portEventsResponse.error) {
        showNotification(getErrorNotification(portEventsResponse.status));
        setLoading(false);
        return;
      }
    }

    const { error, status } = await supabase
      .from('berthings')
      .delete()
      .eq('id', data.id);

    setLoading(false);

    if (error) {
      showNotification(getErrorNotification(status));
      return;
    }

    dispatchBerthings({ type: 'deleted', id: data.id });
    showNotification(getBerthingDeletedNotification());
    afterConfirm?.();
  };

  return (
    <DeleteConfirmation
      message={t('message')}
      preview={<BerthingPreview berthing={data} />}
      cancel={cancel}
      onConfirm={onConfirm}
      loading={loading}
    />
  );
}
