'use client';

import { ProgressBarLink } from '@/app/components/ProgressBar';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { usePathname } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { ActionIcon, Group, Radio, Switch, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconSearch, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
const PAGE_SIZE = 15;

export function LocationTable() {
  const t = useTranslations('LocationTable');
  const getErrorNotification = usePostgresErrorNotification();
  const supabase = createClient();
  const [page, setPage] = useState(1);
  const [locodeQuery, setLocodeQuery] = useState('');
  const [locationNameQuery, setLocationNameQuery] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [enabledQuery, setEnabledQuery] = useState<string>('all');
  const [dbLocodeQuery] = useDebouncedValue(locodeQuery, 200);
  const [dblocationNameQuery] = useDebouncedValue(locationNameQuery, 200);
  const [dbcountryQuery] = useDebouncedValue(countryQuery, 200);
  const [dbEnabledQuery] = useDebouncedValue(enabledQuery, 200);
  const queriesRef = useRef({
    locode: '',
    locationName: '',
    country: '',
    dbEnabledQuery: 'all',
  });
  const [records, setRecords] = useState<AppTypes.Location[]>([]);
  const [totalRecords, setTotalRecords] = useState<number | undefined>();
  const pathname = usePathname();

  useEffect(() => {
    queriesRef.current = {
      locode: dbLocodeQuery,
      locationName: dblocationNameQuery,
      country: dbcountryQuery,
      dbEnabledQuery: dbEnabledQuery,
    };

    const queryCount = async () => {
      let query = supabase
        .from('locations')
        .select('*', { count: 'exact', head: true })
        .ilike('locode', `%${dbLocodeQuery}%`)
        .ilike('location_name', `%${dblocationNameQuery}%`)
        .ilike('country', `%${dbcountryQuery}%`);

      if (dbEnabledQuery === 'enabled') {
        query = query.eq('enabled', true);
      } else if (dbEnabledQuery === 'disabled') {
        query = query.eq('enabled', false);
      }

      const { count, error, status } = await query;

      if (error) {
        showNotification(getErrorNotification(status));
        setTotalRecords(0);
        setRecords([]);
        return;
      }
      setTotalRecords(count ?? 0);
    };
    queryCount();
  }, [
    supabase,
    dbLocodeQuery,
    dblocationNameQuery,
    dbcountryQuery,
    dbEnabledQuery,
    getErrorNotification,
  ]);

  useEffect(() => {
    if (!totalRecords) {
      setRecords([]);
      return;
    }

    const totalPages = totalRecords ? Math.ceil(totalRecords / PAGE_SIZE) : 0;
    const lastFrom = (totalPages - 1) * PAGE_SIZE;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    if (from > lastFrom) {
      setPage(totalPages);
      return;
    }

    const dataQuery = async () => {
      let query = supabase
        .from('locations')
        .select('*')
        .order('locode')
        .ilike('locode', `%${queriesRef.current.locode}%`)
        .ilike('location_name', `%${queriesRef.current.locationName}%`)
        .ilike('country', `%${queriesRef.current.country}%`)
        .range(from, to);

      if (queriesRef.current.dbEnabledQuery === 'enabled') {
        query = query.eq('enabled', true);
      } else if (queriesRef.current.dbEnabledQuery === 'disabled') {
        query = query.eq('enabled', false);
      }

      const { data, error, status } = await query;

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      setRecords(data);
    };

    dataQuery();
  }, [totalRecords, page, supabase, getErrorNotification]);

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      minHeight={records.length ? 0 : 180}
      noRecordsText={t('noResults')}
      records={records}
      totalRecords={totalRecords}
      recordsPerPage={PAGE_SIZE}
      idAccessor="locode"
      page={page}
      onPageChange={setPage}
      columns={[
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
                setRecords((oldState) =>
                  oldState.map((location) =>
                    location.locode === locode
                      ? { ...location, enabled: data.enabled }
                      : location
                  )
                );
              }}
            />
          ),
          filtering: enabledQuery !== 'all',
        },
      ]}
    />
  );
}
