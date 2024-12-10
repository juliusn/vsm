import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { createClient } from '@/lib/supabase/server';
import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { CommonServicesProvider } from './CommonServicesContext';
import { CommonServicesTable } from './CommonServicesTable';
import { NewCommonServiceButton } from './NewCommonServiceButton';

export default async function CommonServicesPage() {
  const t = await getTranslations('CommonServicesPage');
  const supabase = createClient();
  const { data, error } = await supabase.from('common_services').select();

  if (error) {
    return <DataUnavailableAlert />;
  }

  return (
    <CommonServicesProvider
      initialState={data.map((row) => row as AppTypes.CommonService)}>
      <Group justify="space-between">
        <Title size="h2">{t('title')}</Title>
        <NewCommonServiceButton />
      </Group>
      <CommonServicesTable />
    </CommonServicesProvider>
  );
}
