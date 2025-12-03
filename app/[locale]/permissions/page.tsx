import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { orderPermissionsSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/server';
import PermissionsTable from './PermissionsTable';
import { Stack, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';

export default async function PermissionsPage() {
  const t = await getTranslations('PermissionsPage');
  const supabase = await createClient();

  const { data } = await supabase
    .from('order_permissions')
    .select(orderPermissionsSelector);

  return (
    <Stack>
      <Title size="h3">{t('orderHandling')}</Title>
      {data ? (
        <PermissionsTable orderPermissions={data} />
      ) : (
        <DataUnavailableAlert />
      )}
    </Stack>
  );
}
