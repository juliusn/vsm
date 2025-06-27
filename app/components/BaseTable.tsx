'use client';

import { DataTable, DataTableProps } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

type WithColumns<T> = {
  columns: Exclude<DataTableProps<T>['columns'], undefined>;
  groups?: never;
};

type WithGroups<T> = {
  columns?: never;
  groups: Exclude<DataTableProps<T>['groups'], undefined>;
};

export type BaseTableProps<T> = DataTableProps<T> &
  (WithColumns<T> | WithGroups<T>);

export function BaseTable<T>({ records, ...props }: BaseTableProps<T>) {
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
