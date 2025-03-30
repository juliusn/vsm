import { Title } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { BerthsTable } from './BerthsTable';

export default async function PortAreaCodePage(props: {
  params: Promise<{ portAreaCode: string }>;
}) {
  const params = await props.params;

  const { portAreaCode } = params;

  const t = await getTranslations('PortAreaCodePage');
  return (
    <>
      <Title size="h4">{t('title')}</Title>
      <BerthsTable portAreaCode={portAreaCode} />
    </>
  );
}
