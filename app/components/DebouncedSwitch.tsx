'use client';

import { Switch, SwitchProps } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useState } from 'react';

type Props = Omit<SwitchProps, 'onChange' | 'checked'> & {
  initialValue: boolean;
  onSave(value: boolean): Promise<void>;
};

export default function DebouncedSwitch({
  initialValue,
  onSave,
  ...props
}: Props) {
  const [checked, setChecked] = useState<boolean>(initialValue);
  const callback = useDebouncedCallback(
    async (nextValue: boolean) => {
      try {
        await onSave(nextValue);
      } catch {
        setChecked(initialValue);
      }
    },
    { delay: 500, flushOnUnmount: true }
  );
  return (
    <Switch
      {...props}
      checked={checked}
      onChange={async (event) => {
        setChecked(event.currentTarget.checked);
        callback(event.currentTarget.checked);
      }}
    />
  );
}
