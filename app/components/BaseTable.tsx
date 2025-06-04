'use client';

import { DataTable, DataTableProps } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

export function BaseTable<T>({ records, ...props }: DataTableProps<T>) {
  const t = useTranslations('BaseTable');

  return (
    <DataTable
      withTableBorder={true}
      borderRadius="sm"
      noRecordsText={t('noResults')}
      minHeight={records && records.length ? 0 : 180}
      records={records}
      {...props}
    />
  );
}
