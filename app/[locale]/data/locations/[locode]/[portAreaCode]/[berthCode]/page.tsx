import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { BerthServiceProvider } from '@/app/context/BerthServiceContext';
import { normalizeTranslations } from '@/lib/normalizers';
import { berthServicesSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/server';
import { BerthService } from '@/lib/types/query-types';
import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { BerthServiceTable } from './BerthServiceTable';
import { NewBerthServiceButton } from './NewBerthServiceButton';

type Params = { locode: string; portAreaCode: string; berthCode: string };

export default async function BerthCodePage(props: {
  params: Promise<Params>;
}) {
  const params = await props.params;
  const { locode, portAreaCode, berthCode } = params;
  const t = await getTranslations('BerthCodePage');
  const supabase = await createClient();
  const { data } = await supabase
    .from('berth_services')
    .select(berthServicesSelector)
    .eq('locode', locode)
    .eq('port_area_code', portAreaCode)
    .eq('berth_code', berthCode);

  return data ? (
    <BerthServiceProvider
      initialValues={normalizeTranslations<BerthService>(data)}>
      <Group justify="space-between">
        <Title size="h2">{t('title')}</Title>
        <NewBerthServiceButton />
      </Group>
      <BerthServiceTable />
    </BerthServiceProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
