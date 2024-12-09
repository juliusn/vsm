import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { NewCommonServiceButton } from './NewCommonServiceButton';
import { EditServiceModalProvider } from './EditServicesModalContext';
import { CommonServicesProvider } from './CommonServicesContext';
import { createClient } from '@/lib/supabase/server';
import { DataUnavailableAlert } from '@/app/components/DataUnavailableAlert';
import { CommonServicesTable } from './CommonServicesTable';
import { DeleteServiceModalProvider } from './DeleteServiceModalContext';

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
      <EditServiceModalProvider>
        <Group justify="space-between">
          <Title size="h2">{t('title')}</Title>
          <NewCommonServiceButton />
        </Group>
        <DeleteServiceModalProvider>
          <CommonServicesTable />
        </DeleteServiceModalProvider>
      </EditServiceModalProvider>
    </CommonServicesProvider>
  );
}
