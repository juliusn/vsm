'use client';

import { Switch } from '@mantine/core';
import { useState } from 'react';

export function ControlledSwitch({
  initialChecked,
  onUpdate,
}: {
  initialChecked: boolean;
  onUpdate: (checked: boolean) => Promise<{ updateState: boolean }>;
}) {
  const [checked, setChecked] = useState(initialChecked);

  return (
    <Switch
      checked={checked}
      onChange={async (event) => {
        const newChecked = event.currentTarget.checked;
        const { updateState } = await onUpdate(newChecked);
        if (updateState) {
          setChecked(newChecked);
        }
      }}
    />
  );
}
