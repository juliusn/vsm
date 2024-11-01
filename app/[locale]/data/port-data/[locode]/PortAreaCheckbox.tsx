'use client';

import { createClient } from '@/lib/supabase/client';
import { Checkbox } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function PortAreaCheckbox({
  portAreaCode,
  initChecked,
}: {
  portAreaCode: string;
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
          .from('port_areas')
          .update({ enabled })
          .eq('port_area_code', portAreaCode);
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
