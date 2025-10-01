import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { BerthServiceProvider } from '@/app/context/BerthServiceContext';
import { createClient } from '@/lib/supabase/server';
import { SimpleGrid } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { LocodeSwitch } from './LocodeSwitch';
import { berthServicesSelector } from '@/lib/querySelectors';
import { normalizeTranslations } from '@/lib/normalizers';

export default async function LocodeLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locode: string }>;
}) {
  const params = await props.params;
  const { locode } = params;
  const { children } = props;
  const t = await getTranslations('LocodeLayout');
  const supabase = await createClient();

  const { data } = await supabase
    .from('berth_services')
    .select(berthServicesSelector)
    .eq('locode', locode);

  return data ? (
    <BerthServiceProvider initialValues={normalizeTranslations(data)}>
      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        <div>{`${t('title')}: ${locode}`}</div>
        <div>
          <LocodeSwitch locode={locode} />
        </div>
      </SimpleGrid>
      {children}
    </BerthServiceProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
