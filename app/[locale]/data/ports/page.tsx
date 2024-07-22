import { PortAreaFeature, PortsApiResponse } from '@/lib/types/ports-api.types';
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

export default async function PortsPage() {
  const t = await getTranslations('Data');
  const response = await fetch(
    'https://meri.digitraffic.fi/api/port-call/v1/ports/FIHEL'
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
  const data: PortsApiResponse = await response.json();

  const portAreaRows = data.portAreas.features.map(
    (feature: PortAreaFeature, index) => (
      <TableTr key={index}>
        <TableTd>{feature.properties.locode}</TableTd>
        <TableTd>{feature.properties.portAreaName}</TableTd>
        <TableTd>{feature.portAreaCode}</TableTd>
        <TableTd>
          {feature.geometry
            ? `${feature.geometry.coordinates[1]}, ${feature.geometry.coordinates[0]}`
            : 'N/A'}
        </TableTd>
      </TableTr>
    )
  );
  const berthRows = data.berths.berths.map((berth, index) => (
    <TableTr key={index}>
      <TableTd>{berth.locode}</TableTd>
      <TableTd>{berth.portAreaCode}</TableTd>
      <TableTd>{berth.berthCode}</TableTd>
      <TableTd>{berth.berthName}</TableTd>
    </TableTr>
  ));

  return (
    <>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>{t('locode')}</TableTh>
            <TableTh>{t('portAreaName')}</TableTh>
            <TableTh>{t('portAreaCode')}</TableTh>
            <TableTh>{t('coordinates')}</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{portAreaRows}</TableTbody>
      </Table>
      <Table>
        <TableThead>
          <TableTr>
            <TableTh>{t('locode')}</TableTh>
            <TableTh>{t('portAreaCode')}</TableTh>
            <TableTh>{t('berthCode')}</TableTh>
            <TableTh>{t('berthName')}</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{berthRows}</TableTbody>
      </Table>
    </>
  );
}
