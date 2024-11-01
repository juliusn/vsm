import { createClient } from '@/lib/supabase/server';
import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { LocationsTable } from './LocationsTable';
import { PortDataProvider } from './PortDataContext';
import { UpdatePortData } from './UpdatePortData';

export default async function PortDataPage() {
  const supabase = createClient();
  const t = await getTranslations('PortDataPage');
  const { data: locations } = await supabase.from('locations').select('*');

  return (
    <PortDataProvider initialLocations={locations || []}>
      <Group justify="space-between">
        <Title size="h4">{t('title')}</Title>
        <UpdatePortData />
      </Group>
      <LocationsTable />
    </PortDataProvider>
  );
}
