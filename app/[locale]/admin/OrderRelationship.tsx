'use client';

import { Counterparty } from '@/lib/types/query-types';
import { WithDictionary } from '@/lib/types/translation';
import { Grid, Text } from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';

interface Props {
  sender: WithDictionary<Counterparty>;
  receiver: WithDictionary<Counterparty>;
}
export default function OrderRelationship({ sender, receiver }: Props) {
  const t = useTranslations('OrderRelationship');
  const locale = useLocale();

  return (
    <Grid>
      <Grid.Col span={5}>
        <Text c="dimmed">{t('sender')}</Text>
      </Grid.Col>
      <Grid.Col span={2}></Grid.Col>
      <Grid.Col span={5}>
        <Text c="dimmed">{t('receiver')}</Text>
      </Grid.Col>
      <Grid.Col span={5}>
        <Text fw={500}>{sender.dictionary[locale].title}</Text>
      </Grid.Col>
      <Grid.Col span={2}>
        <IconArrowRight stroke={1.5} />
      </Grid.Col>
      <Grid.Col span={5}>
        <Text fw={500}>{receiver.dictionary[locale].title}</Text>
      </Grid.Col>
    </Grid>
  );
}
