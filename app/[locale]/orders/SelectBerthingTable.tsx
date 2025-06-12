'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useBerthings } from '@/app/context/BerthingContext';
import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { BerthingRowData } from '@/lib/types/berthing';
import { DataTableColumn, DataTableProps } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';

type Props = Pick<DataTableProps<BerthingRowData>, 'onRowClick'>;

export function SelectBerthingTable(props: Props) {
  const t = useTranslations('BerthingTable');
  const format = useFormatter();

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

  const { berthings: berthings, portEvents: portEvents } = useBerthings();

  const berthingRowData = useMemo(
    () =>
      berthings.map((berthing): BerthingRowData => {
        const arrival =
          portEvents.find(
            (event) =>
              event.berthing === berthing.id && event.type === 'arrival'
          ) || null;
        const departure =
          portEvents.find(
            (event) =>
              event.berthing === berthing.id && event.type === 'departure'
          ) || null;
        return {
          ...berthing,
          created: new Date(berthing.created_at),
          arrival,
          departure,
        };
      }),
    [berthings, portEvents]
  );

  berthingRowData.sort((a, b) => b.created.getTime() - a.created.getTime());

  return (
    <PaginatedTable<BerthingRowData>
      allRecords={berthingRowData}
      columns={columns}
      highlightOnHover={true}
      {...props}
    />
  );
}
