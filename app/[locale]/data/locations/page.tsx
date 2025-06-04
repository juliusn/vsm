import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { LocationQueryTable } from './LocationQueryTable';
import { UpdateLocations } from './UpdateLocations';

export default async function LocationsPage() {
  const t = await getTranslations('LocationsPage');

  return (
    <>
      <Group justify="space-between">
        <Title size="h4">{t('title')}</Title>
        <UpdateLocations />
      </Group>
      <LocationQueryTable />
    </>
  );
}
