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
import { useParams } from 'next/navigation';
import { useState } from 'react';

export function PortAreasTable() {
  const t = useTranslations('PortAreasTable');
  const getErrorNotification = usePostgresErrorNotification();
  const supabase = createClient();
  const pathname = usePathname();
  const [portAreaCodeQuery, setPortAreaCodeQuery] = useState('');
  const [portAreaNameQuery, setPortAreaNameQuery] = useState('');
  const [enabledQuery, setEnabledQuery] = useState('all');
  const { locode: currentLocode }: { locode: string } = useParams();
  const {
    state: { portAreas },
    dispatch,
  } = useLocations();

  const filteredPortAreas = portAreas.filter(
    (portArea) =>
      portArea.locode === currentLocode &&
      new RegExp(portAreaCodeQuery, 'i').test(portArea.port_area_code) &&
      new RegExp(portAreaNameQuery, 'i').test(portArea.port_area_name) &&
      (enabledQuery === 'all' ||
        (enabledQuery === 'enabled' && portArea.enabled) ||
        (enabledQuery === 'disabled' && !portArea.enabled))
  );

  const columns: DataTableColumn<AppTypes.PortArea>[] = [
    {
      accessor: 'port_area_code',
      title: t('portAreaCode'),
      render: ({ port_area_code }) => (
        <ProgressBarLink href={`${pathname}/${port_area_code}`}>
          {port_area_code}
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
              onClick={() => setPortAreaCodeQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={portAreaCodeQuery}
          onChange={(e) => setPortAreaCodeQuery(e.currentTarget.value)}
        />
      ),
      filtering: portAreaCodeQuery !== '',
    },
    {
      accessor: 'port_area_name',
      title: t('portName'),
      filter: (
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setPortAreaNameQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={portAreaNameQuery}
          onChange={(e) => setPortAreaNameQuery(e.currentTarget.value)}
        />
      ),
      filtering: portAreaNameQuery !== '',
    },
    {
      accessor: 'enabled',
      title: t('enabled'),
      render: ({ locode, port_area_code, enabled }) => (
        <Switch
          checked={enabled}
          onChange={async (event) => {
            const newChecked = event.currentTarget.checked;
            const { data, error, status } = await supabase
              .from('port_areas')
              .update({ enabled: newChecked })
              .eq('locode', locode)
              .eq('port_area_code', port_area_code)
              .select()
              .single();

            if (error) {
              showNotification(getErrorNotification(status));
              return;
            }

            dispatch({
              type: ActionTypes.UPDATE_PORT_AREA_ENABLED,
              payload: {
                locode: data.locode,
                portAreaCode: data.port_area_code,
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
      allRecords={filteredPortAreas}
      columns={columns}
      idAccessor={({ locode, port_area_code }) => `${locode} ${port_area_code}`}
    />
  );
}
