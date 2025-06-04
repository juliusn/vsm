'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useDockings } from '@/app/context/DockingContext';
import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { DockingRowData } from '@/lib/types/docking';
import { DataTableColumn, DataTableProps } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useMemo } from 'react';

type SelectDockingTableProps = Pick<
  DataTableProps<DockingRowData>,
  'onRowClick'
>;

export function SelectDockingTable(props: SelectDockingTableProps) {
  const t = useTranslations('DockingTable');
  const format = useFormatter();

  const columns: DataTableColumn<DockingRowData>[] = [
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

  const { dockings, dockingEvents } = useDockings();

  const dockingRowData = useMemo(
    () =>
      dockings.map((docking): DockingRowData => {
        const arrival =
          dockingEvents.find(
            (event) => event.docking === docking.id && event.type === 'arrival'
          ) || null;
        const departure =
          dockingEvents.find(
            (event) =>
              event.docking === docking.id && event.type === 'departure'
          ) || null;
        return {
          ...docking,
          created: new Date(docking.created_at),
          arrival,
          departure,
        };
      }),
    [dockings, dockingEvents]
  );

  dockingRowData.sort((a, b) => b.created.getTime() - a.created.getTime());

  return (
    <PaginatedTable<DockingRowData>
      allRecords={dockingRowData}
      columns={columns}
      highlightOnHover={true}
      {...props}
    />
  );
}
