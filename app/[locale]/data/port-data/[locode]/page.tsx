import { PortAreaFeature, PortsApiResponse } from '@/lib/types/ports-api.types';
import { Link } from '@/navigation';
import {
  Alert,
  Table,
  TableCaption,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Title,
} from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';
import { IncludeCheckbox } from './IncludeCheckbox';

export default async function LocodePage({
  params: { locode },
}: {
  params: { locode: string };
}) {
  const t = await getTranslations('LocodePage');
  const response = await fetch(
    `https://meri.digitraffic.fi/api/port-call/v1/ports/${locode}`
  );
  let portAreas: PortAreaFeature[] = [];
  if (response.ok) {
    const data: PortsApiResponse = await response.json();
    portAreas = data.portAreas.features;
  }
  const portAreaRows = portAreas.map(
    ({ portAreaCode, properties: { portAreaName } }) => (
      <TableTr key={portAreaCode}>
        <TableTd>
          <IncludeCheckbox portAreaCode={portAreaCode} />
        </TableTd>
        <TableTd>
          <Link href={`/data/port-data/${locode}/${portAreaCode}`}>
            {portAreaCode}
          </Link>
        </TableTd>
        <TableTd>{portAreaName}</TableTd>
      </TableTr>
    )
  );
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
      <Title size="h4">{t('title')}</Title>
      <Table captionSide="top">
        <TableCaption>{t('caption')}</TableCaption>
        <TableThead>
          <TableTr>
            <TableTh>{t('select')}</TableTh>
            <TableTh>{t('portAreaCode')}</TableTh>
            <TableTh>{t('portName')}</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>{portAreaRows}</TableTbody>
      </Table>
    </>
  );
}
