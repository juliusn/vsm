'use client';

import { DataTable } from 'mantine-datatable';
import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

const PAGE_SIZE = 15;

const dateTimeFormatOptions: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

const dateFormatOptions: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

interface DockingRow extends AppTypes.Docking {
  eta: string;
  etd: string;
}

interface DockingsTableProps {
  dockings: AppTypes.Docking[];
  dockingEvents: AppTypes.DockingEvent[];
  loading: boolean;
}

export function DockingsTable({
  dockings,
  dockingEvents,
  loading,
}: DockingsTableProps) {
  const t = useTranslations('DockingsTable');
  const dockingRows = useDockingRows(dockings, dockingEvents);
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<DockingRow[]>(
    dockingRows.slice(0, PAGE_SIZE)
  );

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(dockingRows.slice(from, to));
  }, [page, dockingRows]);

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      minHeight={records.length ? 0 : 180}
      noRecordsText={t('noResults')}
      records={records}
      totalRecords={dockings.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={setPage}
      fetching={loading}
      columns={[
        {
          accessor: 'created_at',
          title: t('created'),
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
        },
        {
          accessor: 'etd',
          title: t('departure'),
        },
      ]}
    />
  );
}

function useDockingRows(
  dockings: AppTypes.Docking[],
  dockingEvents: AppTypes.DockingEvent[]
) {
  const t = useTranslations('DockingsTable');
  const format = useFormatter();
  const dockingRows = useMemo(
    () =>
      dockings
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((docking): DockingRow => {
          const arrival = dockingEvents.find(
            (event) => event.docking === docking.id && event.type === 'arrival'
          );

          const departure = dockingEvents.find(
            (event) =>
              event.docking === docking.id && event.type === 'departure'
          );

          const eta = arrival
            ? arrival.estimated_time
              ? format.dateTime(
                  new Date(
                    `${arrival.estimated_date}T${arrival.estimated_time}`
                  ),
                  dateTimeFormatOptions
                )
              : format.dateTime(
                  new Date(arrival.estimated_date),
                  dateFormatOptions
                )
            : t('unknown');

          const etd = departure
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
            : t('unknown');

          return {
            ...docking,
            created_at: format.dateTime(
              new Date(docking.created_at),
              dateTimeFormatOptions
            ),
            eta,
            etd,
          };
        }),
    [dockings, dockingEvents, t, format]
  );

  return dockingRows;
}
