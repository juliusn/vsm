import { DockingRowData } from '@/lib/types/docking';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { useDockings } from '../[locale]/orders/DockingContext';
import { DataTableProps } from 'mantine-datatable';

const PAGE_SIZE = 15;

export function useDockingDataTableProps(): Partial<
  DataTableProps<DockingRowData>
> {
  const t = useTranslations('DockingsTable');
  const { dockings, dockingEvents } = useDockings();
  const dockingRowData = useDockingRowData(dockings, dockingEvents);
  dockingRowData.sort((a, b) => b.created.getTime() - a.created.getTime());
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<DockingRowData[]>(
    dockingRowData.slice(0, PAGE_SIZE)
  );

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(dockingRowData.slice(from, to));
  }, [page, dockingRowData]);

  return {
    withTableBorder: true,
    borderRadius: 'sm',
    minHeight: records.length ? 0 : 180,
    noRecordsText: t('noResults'),
    records,
    totalRecords: dockings.length,
    recordsPerPage: PAGE_SIZE,
    page,
    onPageChange: setPage,
  };
}

function useDockingRowData(
  dockings: AppTypes.Docking[],
  dockingEvents: AppTypes.DockingEvent[]
) {
  return useMemo(
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
}
