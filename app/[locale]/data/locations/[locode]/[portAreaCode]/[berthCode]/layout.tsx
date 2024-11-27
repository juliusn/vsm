import { SimpleGrid, Stack } from '@mantine/core';
import { getTranslations } from 'next-intl/server';
import { BerthSwitch } from './BerthSwitch';

export default async function BerthCodeLayout({
  children,
  params: { locode, portAreaCode, berthCode },
}: {
  children: React.ReactNode;
  params: { locode: string; portAreaCode: string; berthCode: string };
}) {
  const t = await getTranslations('BerthCodeLayout');

  return (
    <Stack>
      <SimpleGrid cols={{ base: 2, sm: 4 }}>
        <div>{`${t('title')}: ${berthCode}`}</div>
        <div>
          <BerthSwitch
            locode={locode}
            portAreaCode={portAreaCode}
            berthCode={berthCode}
          />
        </div>
      </SimpleGrid>
      {children}
    </Stack>
  );
}
