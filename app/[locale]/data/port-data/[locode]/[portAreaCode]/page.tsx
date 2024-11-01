import {
  Table,
  TableCaption,
  TableTbody,
  TableTh,
  TableThead,
  TableTr,
  Title,
} from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import BerthRows from './BerthRows';

export default async function PortAreaCodePage({
  params: { locode, portAreaCode },
}: {
  params: { locode: string; portAreaCode: string };
}) {
  const t = await getTranslations('PortAreaCodePage');
  return (
    <>
      <Title size="h4">{t('title')}</Title>
      <Table captionSide="top">
        <TableCaption>{t('caption')}</TableCaption>
        <TableThead>
          <TableTr>
            <TableTh>{t('select')}</TableTh>
            <TableTh>{t('berthCode')}</TableTh>
            <TableTh>{t('berthName')}</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          <BerthRows locode={locode} portAreaCode={portAreaCode} />
        </TableTbody>
      </Table>
    </>
  );
}
