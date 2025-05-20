'use client';

import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { DockingRowData } from '@/lib/types/docking';
import { ActionIcon, Center, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { DeleteDockingConfirmation } from './DeleteDockingConfirmation';
import { EditDockingForm } from './EditDockingForm';

const PAGE_SIZE = 15;

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
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(dockingRowData.slice(from, to));
  }, [page, dockingRowData]);

  return (
    <>
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title={t('editDocking')}>
        {selectedRow && (
          <EditDockingForm dockingRow={selectedRow} close={closeEditModal} />
        )}
      </Modal>
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('deleteDocking')}>
        {selectedRow && (
          <DeleteDockingConfirmation
            cancel={closeDeleteModal}
            data={selectedRow}
            afterConfirm={closeDeleteModal}
          />
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
          {
            accessor: 'edit',
            title: t('edit'),
            render: (dockingRow) => (
              <Center>
                <ActionIcon
                  variant="subtle"
                  onClick={() => {
                    setSelectedRow(dockingRow);
                    openEditModal();
                  }}>
                  <IconEdit stroke={1.5} />
                </ActionIcon>
              </Center>
            ),
          },
          {
            accessor: 'delete',
            title: t('delete'),
            render: (dockingRow) => (
              <Center>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => {
                    setSelectedRow(dockingRow);
                    openDeleteModal();
                  }}>
                  <IconTrash stroke={1.5} />
                </ActionIcon>
              </Center>
            ),
          },
        ]}
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
