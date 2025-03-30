import { SimpleGrid } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { PortAreaSwitch } from './PortAreaSwitch';

export default async function PortAreaCodeLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locode: string; portAreaCode: string }>;
}) {
  const params = await props.params;

  const { locode, portAreaCode } = params;

  const { children } = props;

  const t = await getTranslations('PortAreaCodeLayout');
  return (
    <>
      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        <div>{`${t('title')}: ${portAreaCode}`}</div>
        <div>
          <PortAreaSwitch locode={locode} portAreaCode={portAreaCode} />
        </div>
      </SimpleGrid>
      {children}
    </>
  );
}
