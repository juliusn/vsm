'use client';

import { useState } from 'react';
import { BaseTable, BaseTableProps } from './BaseTable';

type Props<T> = BaseTableProps<T> & {
  allRecords: T[];
  onPageChanged?(page: number): void;
  currentPage?: number;
};

export const PAGINATED_TABLE_PAGE_SIZE = 15;

export function PaginatedTable<T>({
  allRecords,
  onPageChanged,
  currentPage,
  ...props
}: Props<T>) {
  const [uncontrolledPage, setUncontrolledPage] = useState(1);
  const page = currentPage ?? uncontrolledPage;
  const from = (page - 1) * PAGINATED_TABLE_PAGE_SIZE;
  const to = from + PAGINATED_TABLE_PAGE_SIZE;
  const records = allRecords.slice(from, to);

  return (
    <BaseTable<T>
      records={records}
      totalRecords={allRecords.length}
      page={page}
      onPageChange={(nextPage) => {
        if (currentPage === undefined) {
          setUncontrolledPage(nextPage);
        }

        onPageChanged?.(nextPage);
      }}
      recordsPerPage={PAGINATED_TABLE_PAGE_SIZE}
      {...props}
    />
  );
}
