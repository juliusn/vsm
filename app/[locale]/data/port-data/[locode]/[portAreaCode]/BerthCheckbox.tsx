'use client';

import { createClient } from '@/lib/supabase/client';
import { Checkbox } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function BerthCheckbox({
  berthCode,
  initChecked,
}: {
  berthCode: string;
  initChecked: boolean;
}) {
  const t = useTranslations('ErrorNotification');
  const [checked, setChecked] = useState(initChecked);
  const supabase = createClient();
  return (
    <Checkbox
      checked={checked}
      onChange={async (event) => {
        const enabled = event.currentTarget.checked;
        const { status, error } = await supabase
          .from('berths')
          .update({ enabled })
          .eq('berth_code', berthCode);
        if (error) {
          showNotification({
            title: t('errorTitle'),
            message: t.rich('errorMessage', {
              status,
            }),
            icon: <IconExclamationMark stroke={1.5} />,
            color: 'red',
          });
        } else {
          setChecked(enabled);
        }
      }}
    />
  );
}
