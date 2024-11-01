import { Button } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function DeleteAllButton({
  callback,
}: {
  callback: () => Promise<void>;
}) {
  const t = useTranslations('DeleteAllButton');
  const [loading, setLoading] = useState(false);
  return (
    <Button
      leftSection={<IconTrash stroke={1.5} />}
      color="red"
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
