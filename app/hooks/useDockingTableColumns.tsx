'use client';

import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { DockingRowData } from '@/lib/types/docking';
import { ActionIcon, Center } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';

export function useDockingTableColumns({
  setSelectedRow,
  openEditModal,
  openDeleteModal,
}: {
  setSelectedRow: Dispatch<SetStateAction<DockingRowData | null>>;
  openEditModal: () => void;
  openDeleteModal: () => void;
}): DataTableColumn<DockingRowData>[] {
  const t = useTranslations('DockingsTable');
  const format = useFormatter();
  return [
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
  ];
}
