'use client';

import { useErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { showNotification } from '@mantine/notifications';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

const PAGE_SIZE = 15;

export function DockingsTable() {
  const t = useTranslations('DockingsTable');
  const supabase = createClient();
  const getErrorNotification = useErrorNotification();
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<AppTypes.Docking[]>([]);
  const totalRecords = records.length;

  useEffect(() => {
    const totalPages = totalRecords ? Math.ceil(totalRecords / PAGE_SIZE) : 0;
    const lastFrom = (totalPages - 1) * PAGE_SIZE;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    if (from > lastFrom) {
      setPage(totalPages || 1);
      return;
    }

    const fetchDockings = async () => {
      const { data, error, status } = await supabase
        .from('dockings')
        .select('*')
        .range(from, to);

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      setRecords(data);
    };

    fetchDockings();
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
      page={page}
      onPageChange={setPage}
      columns={[
        { accessor: 'created_at', title: t('created') },
        { accessor: 'vessel_imo', title: t('vesselImo') },
      ]}
    />
  );
}
