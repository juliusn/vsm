'use client';

import { Button, Group } from '@mantine/core';
import { useRouter } from 'next-intl/client';

export function HeaderLoginContent({
  loginButtonLabel,
  registerButtonLabel,
}: {
  loginButtonLabel: string;
  registerButtonLabel: string;
}) {
  const router = useRouter();
  return (
    <Group className="gap-8 xs:gap-16">
      <Group gap={8}>
        <Button
          onClick={() => router.push('/login')}
          hiddenFrom="xs"
          size="compact-xs"
          variant="outline">
          {loginButtonLabel}
        </Button>
        <Button
          onClick={() => router.push('/register')}
          hiddenFrom="xs"
          size="compact-xs"
          variant="outline">
          {registerButtonLabel}
        </Button>
      </Group>
      <Button
        onClick={() => router.push('/login')}
        visibleFrom="xs"
        variant="outline">
        {loginButtonLabel}
      </Button>
      <Button
        onClick={() => router.push('/register')}
        visibleFrom="xs"
        variant="outline">
        {registerButtonLabel}
      </Button>
    </Group>
  );
}
