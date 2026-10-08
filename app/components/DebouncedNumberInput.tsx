'use client';

import { NumberInput, NumberInputProps } from '@mantine/core';
import { useDebouncedCallback } from '@mantine/hooks';
import { useState } from 'react';

type Props = Omit<NumberInputProps, 'onBlur' | 'onChange' | 'value'> & {
  initialValue: number;
  onSave(value: number): Promise<void>;
};

export function DebouncedNumberInput({
  initialValue,
  onSave,
  ...props
}: Props) {
  const [value, setValue] = useState<string | number>(initialValue);
  const callback = useDebouncedCallback(
    async (nextValue: number) => {
      try {
        await onSave(nextValue);
      } catch {
        setValue(initialValue);
      }
    },
    { delay: 500, flushOnUnmount: true }
  );
  return (
    <NumberInput
      {...props}
      value={value}
      onChange={(nextValue) => {
        setValue(nextValue);
        if (typeof nextValue === 'number') {
          callback(nextValue);
        } else {
          callback.cancel();
        }
      }}
      onBlur={callback.flush}
    />
  );
}
