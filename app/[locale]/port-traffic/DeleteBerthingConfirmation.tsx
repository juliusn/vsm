'use client';

import { DeleteConfirmation } from '@/app/components/DeleteConfirmation';
import { BerthingPreview } from '@/app/components/BerthingPreview';
import {
  useBerthingDeletedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { BerthingRowData } from '@/lib/types/berthing';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useBerthings } from '@/app/context/BerthingContext';

export function DeleteBerthingConfirmation({
  data,
  cancel,
  afterConfirm,
}: {
  data: BerthingRowData;
  cancel(): void;
  afterConfirm?: () => void;
}) {
  const t = useTranslations('DeleteBerthingConfirmation');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { dispatchBerthings, dispatchPortEvents } = useBerthings();
  const getErrorNotification = usePostgresErrorNotification();
  const getBerthingDeletedNotification = useBerthingDeletedNotification();

  return (
    <DeleteConfirmation
      message={t('message')}
      preview={<BerthingPreview data={data} />}
      cancel={cancel}
      onConfirm={async () => {
        setLoading(true);

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
        dispatchPortEvents({
          type: 'cascade-deleted',
          id: data.id,
          foreignKey: 'berthing',
        });
        showNotification(getBerthingDeletedNotification());
        close();
        afterConfirm?.();
      }}
      loading={loading}
    />
  );
}
