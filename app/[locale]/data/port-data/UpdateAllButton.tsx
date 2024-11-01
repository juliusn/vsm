'use client';

import { Button } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function UpdateAllButton({
  callback,
}: {
  callback: () => Promise<void>;
}) {
  const t = useTranslations('UpdateAllButton');
  const [loading, setLoading] = useState(false);

  return (
    <Button
      leftSection={<IconRefresh stroke={1.5} />}
      loading={loading}
      onClick={async (event) => {
        event.preventDefault();
        setLoading(true);
        await callback();
        setLoading(false);
      }}>
      {t('label')}
    </Button>
  );
}
