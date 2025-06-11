import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { CommonServiceProvider } from '@/app/context/CommonServiceContext';
import { createClient } from '@/lib/supabase/server';
import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { CommonServiceTable } from './CommonServiceTable';
import { NewCommonServiceButton } from './NewCommonServiceButton';

export default async function CommonServicesPage() {
  const t = await getTranslations('CommonServicesPage');
  const supabase = await createClient();
  const { data } = await supabase.from('common_services').select();

  return data ? (
    <CommonServiceProvider
      initialValues={data.map((service) => ({
        ...service,
        titles: service.titles as AppTypes.ServiceTitles,
      }))}>
      <Group justify="space-between">
        <Title size="h2">{t('title')}</Title>
        <NewCommonServiceButton />
      </Group>
      <CommonServiceTable />
    </CommonServiceProvider>
  ) : (
    <DataUnavailableAlert />
  );
}
