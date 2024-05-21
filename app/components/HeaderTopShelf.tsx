'use client';

import { Burger } from '@mantine/core';

export function HeaderTopShelf({
  children,
  opened,
  toggle,
}: {
  children: React.ReactNode;
  opened: boolean;
  toggle: () => void;
}) {
  return (
    <div className="xs:h-20 md:h-30 w-full flex justify-between align-top md:mt-8">
      <div className="flex h-min w-full justify-between items-center">
        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
        {children}
      </div>
    </div>
  );
}
