'use client';

import { Checkbox } from '@mantine/core';
import { useState } from 'react';

interface ControlledCheckboxProps {
  index: number;
  enabled: boolean;
  onToggle(index: number, checked: boolean): Promise<void>;
}

export function ControlledCheckbox({
  index,
  enabled,
  onToggle,
}: ControlledCheckboxProps) {
  const [localEnabled, setLocalEnabled] = useState(enabled);
  const [loading, setLoading] = useState(false);

  return (
    <Checkbox
      checked={localEnabled}
      disabled={loading}
      onChange={async (event) => {
        const checked = event.target.checked;
        setLocalEnabled(checked);
        setLoading(true);
        await onToggle(index, checked);
        setLoading(false);
      }}
    />
  );
}
