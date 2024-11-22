'use client';

import { ProgressBarLink } from '@/app/components/ProgressBar';
import { usePathname } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { ActionIcon, Badge, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconExclamationMark, IconSearch, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
const PAGE_SIZE = 15;

export function LocationsTable() {
  const t = useTranslations('LocationsTable');
  const supabase = createClient();
  const [page, setPage] = useState(1);
  const [locodeQuery, setLocodeQuery] = useState('');
  const [locationNameQuery, setLocationNameQuery] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [dbLocodeQuery] = useDebouncedValue(locodeQuery, 200);
  const [dblocationNameQuery] = useDebouncedValue(locationNameQuery, 200);
  const [dbcountryQuery] = useDebouncedValue(countryQuery, 200);
  const queriesRef = useRef({
    locode: '',
    locationName: '',
    country: '',
  });
  const [records, setRecords] = useState<AppTypes.Location[]>([]);
  const [totalRecords, setTotalRecords] = useState<number | undefined>();
  const pathname = usePathname();

  const displayError = useCallback(
    (status: number) => {
      showNotification({
        title: t('errorTitle'),
        message: t.rich('errorMessage', {
          status,
        }),
        icon: <IconExclamationMark stroke={1.5} />,
        color: 'red',
      });
    },
    [t]
  );

  useEffect(() => {
    queriesRef.current = {
      locode: dbLocodeQuery,
      locationName: dblocationNameQuery,
      country: dbcountryQuery,
    };

    const queryCount = async () => {
      const { count, error, status } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true })
        .ilike('locode', `%${dbLocodeQuery}%`)
        .ilike('location_name', `%${dblocationNameQuery}%`)
        .ilike('country', `%${dbcountryQuery}%`);

      if (error) {
        displayError(status);
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
    displayError,
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
      const { data, error, status } = await supabase
        .from('locations')
        .select('*')
        .ilike('locode', `%${queriesRef.current.locode}%`)
        .ilike('location_name', `%${queriesRef.current.locationName}%`)
        .ilike('country', `%${queriesRef.current.country}%`)
        .range(from, to);

      if (error) {
        displayError(status);
        return;
      }

      setRecords(data);
    };

    dataQuery();
  }, [totalRecords, page, supabase, displayError]);

  return (
    <DataTable
      withTableBorder
      minHeight={records.length ? 0 : 180}
      noRecordsText={t('noResults')}
      records={records}
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
              onChange={(e) => {
                setCountryQuery(e.currentTarget.value);
              }}
            />
          ),
          filtering: countryQuery !== '',
        },
        {
          accessor: 'enabled',
          title: t('enabled'),
          render: ({ enabled }) => (
            <Badge
              radius="xs"
              variant={enabled ? 'filled' : 'light'}
              color={enabled ? 'green' : 'gray'}>
              {enabled ? t('yes') : t('no')}
            </Badge>
          ),
        },
      ]}
      idAccessor="locode"
      totalRecords={totalRecords}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={setPage}
    />
  );
}
