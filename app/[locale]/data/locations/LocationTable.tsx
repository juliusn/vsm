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

export function LocationTable() {
  const t = useTranslations('LocationTable');
  const pathname = usePathname();
  const [locodeQuery, setLocodeQuery] = useState('');
  const [locationNameQuery, setLocationNameQuery] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [enabledQuery, setEnabledQuery] = useState<string>('all');
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const {
    state: { locations },
    dispatch,
  } = useLocations();
  const columns: DataTableColumn<AppTypes.Location>[] = [
    {
      accessor: 'locode',
      title: t('locode'),
      render: ({ locode }) => (
        <ProgressBarLink href={`${pathname}/${locode}`}>
          {locode}
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
              onClick={() => setLocodeQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={locodeQuery}
          onChange={(e) => setLocodeQuery(e.currentTarget.value)}
        />
      ),
      filtering: locodeQuery !== '',
    },
    {
      accessor: 'location_name',
      title: t('locationName'),
      filter: (
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setLocationNameQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={locationNameQuery}
          onChange={(e) => setLocationNameQuery(e.currentTarget.value)}
        />
      ),
      filtering: locationNameQuery !== '',
    },
    {
      accessor: 'country',
      title: t('country'),
      filter: (
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setCountryQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={countryQuery}
          onChange={(e) => setCountryQuery(e.currentTarget.value)}
        />
      ),
      filtering: countryQuery !== '',
    },
    {
      accessor: 'enabled',
      title: t('enabled'),
      filter: (
        <Radio.Group value={enabledQuery} onChange={setEnabledQuery}>
          <Group>
            <Radio value="all" label={t('all')} />
            <Radio value="enabled" label={t('yes')} />
            <Radio value="disabled" label={t('no')} />
          </Group>
        </Radio.Group>
      ),
      render: ({ locode, enabled }) => (
        <Switch
          checked={enabled}
          onChange={async (event) => {
            const newChecked = event.currentTarget.checked;
            const { data, error, status } = await supabase
              .from('locations')
              .update({ enabled: newChecked })
              .eq('locode', locode)
              .select()
              .single();

            if (error) {
              showNotification(getErrorNotification(status));
              return;
            }

            dispatch({
              type: ActionTypes.UPDATE_LOCATION_ENABLED,
              payload: { locode, enabled: data.enabled },
            });
          }}
        />
      ),
      filtering: enabledQuery !== 'all',
    },
  ];
  return <PaginatedTable allRecords={locations} columns={columns} />;
}
