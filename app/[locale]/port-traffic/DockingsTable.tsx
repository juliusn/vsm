'use client';

import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DataTable } from 'mantine-datatable';
import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { EditDockingForm } from './EditDockingForm';

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

export interface DockingRowData extends AppTypes.Docking {
  created: Date;
  arrival: AppTypes.DockingEvent | null;
  departure: AppTypes.DockingEvent | null;
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
  const format = useFormatter();
  const dockingRowData = useDockingRowData(dockings, dockingEvents);
  dockingRowData.sort((a, b) => b.created.getTime() - a.created.getTime());
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<DockingRowData[]>(
    dockingRowData.slice(0, PAGE_SIZE)
  );
  const [selectedRow, setSelectedRow] = useState<DockingRowData | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(dockingRowData.slice(from, to));
  }, [page, dockingRowData]);

  return (
    <>
      <Modal opened={opened} onClose={close} title={t('modalTitle')}>
        {selectedRow && (
          <EditDockingForm dockingRow={selectedRow} close={close} />
        )}
      </Modal>
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
            render: ({ created }) =>
              format.dateTime(created, dateTimeFormatOptions),
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
                      new Date(
                        `${arrival.estimated_date}T${arrival.estimated_time}`
                      ),
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
        ]}
        onRowClick={({ record }) => {
          setSelectedRow(record);
          open();
        }}
      />
    </>
  );
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
