'use client';

import { createClient } from '@/lib/supabase/client';
import { Switch } from '@mantine/core';
import { useState } from 'react';

export function EnabledSwitch({
  locode,
  enabled,
  displayError,
}: {
  locode: string;
  enabled: boolean;
  displayError: (status: number) => void;
}) {
  const [checked, setChecked] = useState(enabled);
  const supabase = createClient();
  return (
    <Switch
      checked={checked}
      onChange={async (event) => {
        const enabled = event.currentTarget.checked;
        const { error, status } = await supabase
          .from('locations')
          .update({ enabled })
          .eq('locode', locode);

        if (error) {
          displayError(status);
          return;
        }

        setChecked(enabled);
      }}
    />
  );
}
