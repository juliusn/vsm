'use client';

import { DataTableProps } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { BaseTable } from './BaseTable';

type Props<T> = Pick<
  DataTableProps<T>,
  'onRowClick' | 'idAccessor' | 'rowClassName'
> &
  Required<Pick<DataTableProps<T>, 'columns'>> & {
    allRecords: T[];
  };

const PAGE_SIZE = 15;

export function PaginatedTable<T>({ allRecords, ...props }: Props<T>) {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<T[]>(allRecords.slice(0, PAGE_SIZE));

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(allRecords.slice(from, to));
  }, [page, allRecords]);

  return (
    <BaseTable<T>
      records={records}
      totalRecords={allRecords.length}
      page={page}
      onPageChange={setPage}
      recordsPerPage={PAGE_SIZE}
      {...props}
    />
  );
}
