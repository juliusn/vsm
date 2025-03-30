import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { NewBerthServiceContent } from '../NewBerthServiceContent';
import { ServicesTable } from './ServicesTable';

export default async function BerthCodePage(props: {
  params: Promise<{ locode: string; portAreaCode: string; berthCode: string }>;
}) {
  const params = await props.params;

  const { locode, portAreaCode, berthCode } = params;

  const t = await getTranslations('BerthCodePage');
  return (
    <>
      <Group justify="space-between">
        <Title size="h2">{t('title')}</Title>
        <NewBerthServiceContent
          locode={locode}
          portAreaCode={portAreaCode}
          berthCode={berthCode}
        />
      </Group>

      <ServicesTable
        locode={locode}
        portAreaCode={portAreaCode}
        berthCode={berthCode}
      />
    </>
  );
}
