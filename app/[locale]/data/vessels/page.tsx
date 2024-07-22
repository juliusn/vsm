import { VesselsApiResponse } from '@/lib/types/vessels-api.types';
import {
  Alert,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
} from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

export default async function VesselsPage() {
  const t = await getTranslations('Data');
  const response = await fetch(
    'https://meri.digitraffic.fi/api/ais/v1/vessels'
  );
  if (!response.ok) {
    const { status, statusText } = response;
    return (
      <Alert
        variant="outline"
        color="red"
        title={t('dataAlertTitle')}
        icon={<IconExclamationCircle stroke={1.5} />}>
        {t('dataAlertMessage', { status, statusText })}
      </Alert>
    );
  }
  const data: VesselsApiResponse = await response.json();
  const vesselsApiRows = data.map((vessel, index) => (
    <TableTr key={index}>
      <TableTd>{vessel.mmsi}</TableTd>
      <TableTd>{vessel.name}</TableTd>
    </TableTr>
  ));

  return (
    <Table>
      <TableThead>
        <TableTr>
          <TableTh>{t('mmsi')}</TableTh>
          <TableTh>{t('name')}</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>{vesselsApiRows}</TableTbody>
    </Table>
  );
}
