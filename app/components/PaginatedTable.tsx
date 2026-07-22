'use client';

import { useEffect, useState } from 'react';
import { BaseTable, BaseTableProps } from './BaseTable';

type Props<T> = BaseTableProps<T> & {
  allRecords: T[];
  onPageChanged?(page: number): void;
};

export const PAGINATED_TABLE_PAGE_SIZE = 15;

export function PaginatedTable<T>({
  allRecords,
  onPageChanged,
  ...props
}: Props<T>) {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<T[]>(
    allRecords.slice(0, PAGINATED_TABLE_PAGE_SIZE)
  );

  useEffect(() => {
    const from = (page - 1) * PAGINATED_TABLE_PAGE_SIZE;
    const to = from + PAGINATED_TABLE_PAGE_SIZE;
    setRecords(allRecords.slice(from, to));
  }, [page, allRecords]);

  return (
    <BaseTable<T>
      records={records}
      totalRecords={allRecords.length}
      page={page}
      onPageChange={(nextPage) => {
        setPage(nextPage);
        onPageChanged?.(nextPage);
      }}
      recordsPerPage={PAGINATED_TABLE_PAGE_SIZE}
      {...props}
    />
  );
}
