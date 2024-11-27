import { Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { PortAreasTable } from './PortAreasTable';

export default async function LocodePage() {
  const t = await getTranslations('LocodePage');

  return (
    <>
      <Title size="h4">{t('title')}</Title>
      <PortAreasTable />
    </>
  );
}
