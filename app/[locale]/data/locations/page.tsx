import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { LocationsTable } from './LocationsTable';
import { UpdatePortData } from './UpdatePortData';

export default async function PortDataPage() {
  const t = await getTranslations('PortDataPage');

  return (
    <>
      <Group justify="space-between">
        <Title size="h4">{t('title')}</Title>
        <UpdatePortData />
      </Group>
      <LocationsTable />
    </>
  );
}
