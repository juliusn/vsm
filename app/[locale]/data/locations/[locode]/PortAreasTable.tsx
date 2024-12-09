'use client';

import { ProgressBarLink } from '@/app/components/ProgressBar';
import { useErrorNotification } from '@/app/hooks/notifications';
import { usePathname } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { ActionIcon, Group, Radio, Switch, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconSearch, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ActionTypes, useLocation } from './LocationContext';
const PAGE_SIZE = 15;

export function PortAreasTable() {
  const t = useTranslations('PortAreasTable');
  const getErrorNotification = useErrorNotification();
  const supabase = createClient();
  const [page, setPage] = useState(1);
  const [portAreaCodeQuery, setPortAreaCodeQuery] = useState('');
  const [portAreaNameQuery, setPortAreaNameQuery] = useState('');
  const [enabledQuery, setEnabledQuery] = useState('all');
  const {
    state: { portAreas },
    dispatch,
  } = useLocation();
  const records = portAreas
    .filter(
      (portArea) =>
        new RegExp(portAreaCodeQuery, 'i').test(portArea.port_area_code) &&
        new RegExp(portAreaNameQuery, 'i').test(portArea.port_area_name) &&
        (enabledQuery === 'all' ||
          (enabledQuery === 'enabled' && portArea.enabled) ||
          (enabledQuery === 'disabled' && !portArea.enabled))
    )
    .slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE);
  const pathname = usePathname();

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      minHeight={records.length ? 0 : 180}
      noRecordsText={t('noResults')}
      records={records}
      columns={[
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
      ]}
      idAccessor={({ locode, port_area_code }) => `${locode} ${port_area_code}`}
      totalRecords={portAreas.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={setPage}
    />
  );
}
