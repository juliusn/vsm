import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { CommonServiceProvider } from '@/app/context/CommonServiceContext';
import { createClient } from '@/lib/supabase/server';
import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { NewBerthServiceContent } from '../NewBerthServiceContent';
import { ServicesTable } from './ServicesTable';

export default async function BerthCodePage() {
  const t = await getTranslations('BerthCodePage');
  const supabase = await createClient();
  const { data, error } = await supabase.from('common_services').select();

  if (error) {
    return <DataUnavailableAlert />;
  }

  return (
    <CommonServiceProvider
      initialValues={data.map((row) => ({
        ...row,
        titles: row.titles as AppTypes.ServiceTitles,
      }))}>
      <Group justify="space-between">
        <Title size="h2">{t('title')}</Title>
        <NewBerthServiceContent />
      </Group>
      <ServicesTable />
    </CommonServiceProvider>
  );
}
