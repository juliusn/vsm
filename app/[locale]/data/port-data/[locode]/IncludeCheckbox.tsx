'use client';

import { createClient } from '@/lib/supabase/client';
import { Checkbox } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function IncludeCheckbox({ portAreaCode }: { portAreaCode: string }) {
  const t = useTranslations('IncludeCheckbox');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  return (
    <Checkbox
      checked={checked}
      disabled={loading}
      onChange={async (event) => {
        const selected = event.currentTarget.checked;
        setLoading(true);
        if (selected) {
          const { status } = await supabase
            .from('port-area-codes')
            .upsert({ 'port-area-code': portAreaCode });
          if (status === 201) {
            setChecked(selected);
          } else {
            showNotification({
              title: t('errorTitle'),
              message: t.rich('errorMessage', {
                status,
              }),
              icon: <IconExclamationMark stroke={1.5} />,
              color: 'red',
            });
          }
        } else {
          const { status } = await supabase
            .from('port-area-codes')
            .delete()
            .eq('port-area-code', portAreaCode);
          if (status === 204) {
            setChecked(selected);
          } else {
            showNotification({
              title: t('errorTitle'),
              message: t.rich('errorMessage', {
                status,
              }),
              icon: <IconExclamationMark stroke={1.5} />,
              color: 'red',
            });
          }
        }
        setLoading(false);
      }}
    />
  );
}
