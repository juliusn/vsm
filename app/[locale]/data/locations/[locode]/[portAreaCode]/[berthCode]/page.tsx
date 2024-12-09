import { Group, Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { ServicesTable } from './ServicesTable';
import { NewBerthServiceContent } from '../NewBerthServiceContent';
import { DeleteServiceModalProvider } from './DeleteServiceModalContext';
import { EditServiceModalProvider } from './EditServiceModalProvider';

export default async function BerthCodePage({
  params: { locode, portAreaCode, berthCode },
}: {
  params: { locode: string; portAreaCode: string; berthCode: string };
}) {
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
      <DeleteServiceModalProvider berthCode={berthCode}>
        <EditServiceModalProvider>
          <ServicesTable
            locode={locode}
            portAreaCode={portAreaCode}
            berthCode={berthCode}
          />
        </EditServiceModalProvider>
      </DeleteServiceModalProvider>
    </>
  );
}
