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
import PortAreaRows from './PortAreaRows';

export default async function LocodePage({
  params: { locode },
}: {
  params: { locode: string };
}) {
  const t = await getTranslations('LocodePage');
  return (
    <>
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
        <TableTbody>
          <PortAreaRows locode={locode} />
        </TableTbody>
      </Table>
    </>
  );
}
