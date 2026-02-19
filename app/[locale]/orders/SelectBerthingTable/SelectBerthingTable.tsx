'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useBerthings } from '@/app/context/BerthingContext';
import { useOrders } from '@/app/context/OrderContext';
import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { Berthing } from '@/lib/types/query-types';
import { sortBy } from 'lodash';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import styles from './SelectBerthingTable.module.css';

interface Props {
  initial: string | null;
  selected: string | null;
  onSelect(row: Berthing): void;
}

export function SelectBerthingTable({ initial, selected, onSelect }: Props) {
  const t = useTranslations('BerthingTable');
  const format = useFormatter();
  const { berthings } = useBerthings();
  const { orders } = useOrders();
  const [records, setRecords] = useState(berthings);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Berthing>>({
    columnAccessor: 'created_at',
    direction: 'desc',
  });

  const orderExists = useMemo(
    () => (row: Berthing) =>
      orders.find(
        (order) => order.berthing.id !== initial && order.berthing.id === row.id
      ),
    [orders, initial]
  );

  const columns: DataTableColumn<Berthing>[] = [
    {
      accessor: 'created_at',
      title: t('created'),
      render: ({ created_at }) =>
        format.dateTime(new Date(created_at), dateTimeFormatOptions),
      sortable: true,
    },
    { accessor: 'vessel_imo', title: t('vesselImo'), sortable: true },
    { accessor: 'vessel_name', title: t('vesselName'), sortable: true },
    {
      accessor: 'arrival',
      title: t('arrival'),
      render: ({ arrival }) =>
        arrival
          ? arrival.estimated_time
            ? format.dateTime(
                new Date(`${arrival.estimated_date}T${arrival.estimated_time}`),
                dateTimeFormatOptions
              )
            : format.dateTime(
                new Date(arrival.estimated_date),
                dateFormatOptions
              )
          : t('unknown'),
      sortable: true,
    },
    {
      accessor: 'departure',
      title: t('departure'),
      render: ({ departure }) =>
        departure
          ? departure.estimated_time
            ? format.dateTime(
                new Date(
                  `${departure.estimated_date}T${departure.estimated_time}`
                ),
                dateTimeFormatOptions
              )
            : format.dateTime(
                new Date(departure.estimated_date),
                dateFormatOptions
              )
          : t('unknown'),
      sortable: true,
    },
  ];

  useEffect(() => {
    let data: Berthing[];
    switch (sortStatus.columnAccessor) {
      case 'created_at': {
        data = sortBy(berthings, (berthing) => new Date(berthing.created_at));
        break;
      }
      case 'arrival': {
        data = sortBy(berthings, [
          (berthing) => berthing.arrival?.estimated_date ?? '0000-01-01',
          (berthing) => berthing.arrival?.estimated_time ?? '00:00',
        ]);
        break;
      }
      case 'departure': {
        data = sortBy(berthings, [
          (berthing) => berthing.departure?.estimated_date ?? '0000-01-01',
          (berthing) => berthing.departure?.estimated_time ?? '00:00',
        ]);
        break;
      }
      default: {
        data = sortBy(berthings, sortStatus.columnAccessor);
      }
    }
    setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus, berthings]);

  return (
    <PaginatedTable<Berthing>
      onRowClick={({ record }) => {
        if (record.id === selected || orderExists(record)) {
          return;
        }
        onSelect(record);
      }}
      rowClassName={(record) =>
        record.id === selected
          ? styles.selectedRow
          : orderExists(record)
            ? styles.disabledRow
            : styles.selectableRow
      }
      allRecords={records}
      columns={columns}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
      defaultColumnProps={{
        noWrap: true,
        width: '10rem',
      }}
    />
  );
}
