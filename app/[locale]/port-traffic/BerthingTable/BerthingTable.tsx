'use client';

import { EditBerthingForm } from '@/app/components/BerthingForms/EditBerthingForm';
import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useBerthings } from '@/app/context/BerthingContext';
import { BerthingInputDataProvider } from '@/app/context/BerthingInputDataContext';
import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { Berthing } from '@/lib/types/query-types';
import { ActionIcon, Center, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import sortBy from 'lodash/sortBy';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { DeleteBerthingConfirmation } from '../DeleteBerthingConfirmation';
import classes from './BerthingTable.module.css';

export function BerthingTable() {
  const t = useTranslations('BerthingTable');
  const format = useFormatter();
  const { berthings } = useBerthings();
  const [records, setRecords] = useState(berthings);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Berthing>>({
    columnAccessor: 'created_at',
    direction: 'desc',
  });

  const [selectedBerthing, setSelectedBerthing] = useState<Berthing | null>(
    null
  );

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);

  const columns: DataTableColumn<Berthing>[] = [
    {
      accessor: 'created_at',
      title: t('created'),
      render: ({ created_at }) =>
        format.dateTime(new Date(created_at), dateTimeFormatOptions),
      sortable: true,
    },
    {
      accessor: 'vessel_name',
      title: t('vesselName'),
      render: (berthing) => (
        <Text inherit truncate="end" className={classes.vesselName}>
          {berthing.vessel_name ?? berthing.vessel_imo}
        </Text>
      ),
      sortable: true,
    },
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
      accessor: 'arrival.berth_code',
      title: '',
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
    {
      accessor: 'departure.berth_code',
      title: '',
    },
    {
      accessor: 'edit',
      title: t('edit'),
      render: (berthing) => (
        <Center>
          <ActionIcon
            variant="subtle"
            onClick={() => {
              setSelectedBerthing(berthing);
              openEditModal();
            }}>
            <IconEdit stroke={1.5} />
          </ActionIcon>
        </Center>
      ),
      width: 'auto',
    },
    {
      accessor: 'delete',
      title: t('delete'),
      render: (berthing) => (
        <Center>
          <ActionIcon
            variant="subtle"
            color="red"
            {...(berthing.order === null
              ? {
                  onClick: () => {
                    setSelectedBerthing(berthing);
                    openDeleteModal();
                  },
                }
              : { disabled: true })}>
            <IconTrash stroke={1.5} />
          </ActionIcon>
        </Center>
      ),
      width: 'auto',
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
    <>
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title={t('editBerthing')}>
        {selectedBerthing && (
          <BerthingInputDataProvider selectedBerthing={selectedBerthing}>
            <EditBerthingForm
              initialBerthing={selectedBerthing}
              onCancel={closeEditModal}
              resultCallback={closeEditModal}
            />
          </BerthingInputDataProvider>
        )}
      </Modal>
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('deleteBerthing')}>
        {selectedBerthing && (
          <DeleteBerthingConfirmation
            data={selectedBerthing}
            cancel={closeDeleteModal}
            afterConfirm={closeDeleteModal}
          />
        )}
      </Modal>
      <PaginatedTable<Berthing>
        allRecords={records}
        columns={columns}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        defaultColumnProps={{
          noWrap: true,
        }}
      />
    </>
  );
}
