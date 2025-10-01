'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useBerthings } from '@/app/context/BerthingContext';
import { useOrders } from '@/app/context/OrderContext';
import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { BerthingRowData } from '@/lib/types/berthing';
import { DataTableColumn } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import styles from './SelectBerthingTable.module.css';

export function SelectBerthingTable({
  onSelect,
}: {
  onSelect(row: BerthingRowData): void;
}) {
  const t = useTranslations('BerthingTable');
  const format = useFormatter();
  const { berthings } = useBerthings();
  const { orders } = useOrders();

  const orderExists = useMemo(
    () => (row: BerthingRowData) =>
      orders.find((order) => order.berthing.id === row.id),
    [orders]
  );

  const columns: DataTableColumn<BerthingRowData>[] = [
    {
      accessor: 'created_at',
      title: t('created'),
      render: ({ created }) => format.dateTime(created, dateTimeFormatOptions),
    },
    { accessor: 'vessel_imo', title: t('vesselImo') },
    { accessor: 'vessel_name', title: t('vesselName') },
    {
      accessor: 'berth_code',
      title: t('berth'),
    },
    {
      accessor: 'eta',
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
    },
    {
      accessor: 'etd',
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
    },
  ];

  const berthingRowData = useMemo(
    () =>
      berthings
        .map((berthing): BerthingRowData => {
          const arrival =
            berthing.port_events.find((event) => event.type === 'arrival') ||
            null;
          const departure =
            berthing.port_events.find((event) => event.type === 'departure') ||
            null;
          return {
            ...berthing,
            created: new Date(berthing.created_at),
            arrival,
            departure,
          };
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime()),
    [berthings]
  );

  return (
    <PaginatedTable<BerthingRowData>
      onRowClick={({ record }) => {
        if (orderExists(record)) {
          return;
        }
        onSelect(record);
      }}
      rowClassName={(record) =>
        orderExists(record) ? styles.disabledRow : styles.selectableRow
      }
      allRecords={berthingRowData}
      columns={columns}
    />
  );
}
