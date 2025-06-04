'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { ProgressBarLink } from '@/app/components/ProgressBar';
import { ActionTypes, useLocations } from '@/app/context/LocationContext';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { usePathname } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { ActionIcon, Group, Radio, Switch, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconSearch, IconX } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function BerthsTable({ portAreaCode }: { portAreaCode: string }) {
  const t = useTranslations('BerthsTable');
  const getErrorNotification = usePostgresErrorNotification();
  const supabase = createClient();
  const [berthCodeQuery, setBerthCodeQuery] = useState('');
  const [berthNameQuery, setBerthNameQuery] = useState('');
  const [enabledQuery, setEnabledQuery] = useState('all');
  const {
    state: { berths },
    dispatch,
  } = useLocations();
  const localBerths = berths.filter(
    (berth) => berth.port_area_code === portAreaCode
  );
  const pathname = usePathname();
  const columns: DataTableColumn<AppTypes.Berth>[] = [
    {
      accessor: 'berth_code',
      title: t('berthCode'),
      render: ({ berth_code }) => (
        <ProgressBarLink href={`${pathname}/${berth_code}`}>
          {berth_code}
        </ProgressBarLink>
      ),
      filter: (
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setBerthCodeQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={berthCodeQuery}
          onChange={(e) => setBerthCodeQuery(e.currentTarget.value)}
        />
      ),
      filtering: berthCodeQuery !== '',
    },
    {
      accessor: 'berth_name',
      title: t('berthName'),
      filter: (
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setBerthNameQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={berthNameQuery}
          onChange={(e) => setBerthNameQuery(e.currentTarget.value)}
        />
      ),
      filtering: berthNameQuery !== '',
    },
    {
      accessor: 'enabled',
      title: t('enabled'),
      render: ({ locode, port_area_code, berth_code, enabled }) => (
        <Switch
          checked={enabled}
          onChange={async (event) => {
            const newChecked = event.currentTarget.checked;
            const { data, error, status } = await supabase
              .from('berths')
              .update({ enabled: newChecked })
              .eq('locode', locode)
              .eq('port_area_code', port_area_code)
              .eq('berth_code', berth_code)
              .select()
              .single();

            if (error) {
              showNotification(getErrorNotification(status));
              return;
            }

            dispatch({
              type: ActionTypes.UPDATE_BERTH_ENABLED,
              payload: {
                locode: data.locode,
                portAreaCode: data.port_area_code,
                berthCode: data.berth_code,
                enabled: data.enabled,
              },
            });
          }}
        />
      ),
      filter: (
        <Radio.Group value={enabledQuery} onChange={setEnabledQuery}>
          <Group>
            <Radio value="all" label={t('all')} />
            <Radio value="enabled" label={t('yes')} />
            <Radio value="disabled" label={t('no')} />
          </Group>
        </Radio.Group>
      ),
      filtering: enabledQuery !== 'all',
    },
  ];

  return (
    <PaginatedTable
      allRecords={localBerths}
      columns={columns}
      idAccessor={({ locode, port_area_code, berth_code }) =>
        `${locode} ${port_area_code} ${berth_code}`
      }
    />
  );
}
