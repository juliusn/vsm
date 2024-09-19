import { ProgressBarLink } from '@/app/components/ProgressBar';
import { createClient } from '@/lib/supabase/server';
import { PortsApiResponse } from '@/lib/types/ports-api.types';
import {
  Alert,
  Group,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Title,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { getFormatter, getTranslations } from 'next-intl/server';
import AddLocodeContent from './AddLocodeContent';
import { RemoveLocodeButton } from './DeleteLocodeButton';
import { ModalProvider } from './ModalProvider';

export default async function PortDataPage() {
  const supabase = createClient();
  const t = await getTranslations('PortDataPage');
  const format = await getFormatter();
  const response = await fetch(
    'https://meri.digitraffic.fi/api/port-call/v1/ports'
  );
  const { data: locodes } = await supabase.from('locodes').select('*');
  const addedLocodes = locodes ? locodes.map(({ locode }) => locode) : [];
  const locodeRows = locodes?.map(({ locode, created_at }) => (
    <TableTr key={locode}>
      <TableTd>
        <ProgressBarLink href={`/data/port-data/${locode}`}>
          {locode}
        </ProgressBarLink>
      </TableTd>
      <TableTd>
        {format.dateTime(new Date(created_at), {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })}
      </TableTd>
      <TableTd align="center">
        <RemoveLocodeButton locode={locode} />
      </TableTd>
    </TableTr>
  ));
  let existingLocodes: string[] = [];
  if (response.ok) {
    const data: PortsApiResponse = await response.json();
    const locodes = data.portAreas.features.map((portArea) =>
      portArea.properties.locode.toUpperCase()
    );
    existingLocodes = Array.from(new Set(locodes));
  }
  return (
    <>
      {!response.ok && (
        <Alert
          variant="outline"
          color="yellow"
          icon={<IconAlertTriangle stroke={1.5} />}
          title={t('alertTitle')}>
          {t('alertMessage')}
        </Alert>
      )}
      <Group justify="space-between">
        <Title size="h4">{t('title')}</Title>
        <AddLocodeContent
          existingLocodes={existingLocodes}
          addedLocodes={addedLocodes}
        />
      </Group>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>{t('locode')}</TableTh>
            <TableTh>{t('added')}</TableTh>
            <TableTh styles={{ th: { textAlign: 'center' } }}>
              {t('remove')}
            </TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          <ModalProvider>{locodeRows}</ModalProvider>
        </TableTbody>
      </Table>
    </>
  );
}
