'use client';

import { createClient } from '@/lib/supabase/client';
import { showNotification } from '@mantine/notifications';
import { IconExclamationMark } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
const PAGE_SIZE = 15;

export function LocationsTable() {
  const t = useTranslations('LocationsTable');
  const supabase = createClient();
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<AppTypes.Location[]>([]);
  const [totalRecords, setTotalRecords] = useState<number | undefined>();

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    const query = async () => {
      const { data, count, error, status } = await supabase
        .from('locations')
        .select('*', { count: 'exact' })
        .range(from, to);
      if (error) {
        showNotification({
          title: t('errorTitle'),
          message: t.rich('errorMessage', {
            status,
          }),
          icon: <IconExclamationMark stroke={1.5} />,
          color: 'red',
        });
        return;
      }
      setRecords(data);
      if (count !== null) {
        setTotalRecords(count);
      }
    };
    query();
  }, [page, supabase, t]);

  return (
    <DataTable
      withTableBorder
      records={records}
      columns={[
        {
          accessor: 'locode',
          title: t('locode'),
        },
        { accessor: 'location_name', title: t('locationName') },
        { accessor: 'country', title: t('country') },
      ]}
      idAccessor="locode"
      totalRecords={totalRecords}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}
    />
  );
}
