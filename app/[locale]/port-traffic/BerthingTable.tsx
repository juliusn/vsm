'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useBerthings } from '@/app/context/BerthingContext';
import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { BerthingRowData } from '@/lib/types/berthing';
import { ActionIcon, Center, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { DeleteBerthingConfirmation } from './DeleteBerthingConfirmation';
import { EditBerthingForm } from './EditBerthingForm';

export function BerthingTable() {
  const t = useTranslations('BerthingTable');
  const format = useFormatter();
  const [selectedRow, setSelectedRow] = useState<BerthingRowData | null>(null);
  const { berthings } = useBerthings();
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

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
    {
      accessor: 'edit',
      title: t('edit'),
      render: (berthingRow) => (
        <Center>
          <ActionIcon
            variant="subtle"
            onClick={() => {
              setSelectedRow(berthingRow);
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
      render: (berthingRow) => (
        <Center>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => {
              setSelectedRow(berthingRow);
              openDeleteModal();
            }}>
            <IconTrash stroke={1.5} />
          </ActionIcon>
        </Center>
      ),
    },
  ];

  const berthingRowData = useMemo(
    () =>
      berthings
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
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
        }),
    [berthings]
  );

  berthingRowData.sort((a, b) => b.created.getTime() - a.created.getTime());

  return (
    <>
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title={t('editBerthing')}>
        {selectedRow && (
          <EditBerthingForm berthingRow={selectedRow} close={closeEditModal} />
        )}
      </Modal>
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('deleteBerthing')}>
        {selectedRow && (
          <DeleteBerthingConfirmation
            cancel={closeDeleteModal}
            data={selectedRow}
            afterConfirm={closeDeleteModal}
          />
        )}
      </Modal>
      <PaginatedTable<BerthingRowData>
        allRecords={berthingRowData}
        columns={columns}
      />
    </>
  );
}
