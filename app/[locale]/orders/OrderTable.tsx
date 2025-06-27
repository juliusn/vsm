'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useOrderData } from '@/app/context/OrderContext';
import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { ActionIcon, Center, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { EditOrder } from './EditOrder';

export type OrderRowData = AppTypes.OrderData & {
  created: string;
  arrival: string;
  departure: string;
};

export function OrderTable() {
  const t = useTranslations('OrderTable');
  const locale = useLocale() as AppTypes.Locale;
  const format = useFormatter();
  const { orderData } = useOrderData();
  const [selectedRow, setSelectedRow] = useState<OrderRowData | null>(null);

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const orderRowData = useMemo(
    () =>
      orderData
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((order) => ({
          ...order,
          created: format.dateTime(
            new Date(order.created_at),
            dateTimeFormatOptions
          ),
          arrival: order.berthing.port_events.find(
            (event) => event.type === 'arrival'
          ),
          departure: order.berthing.port_events.find(
            (event) => event.type === 'departure'
          ),
        }))
        .map((order) => ({
          ...order,
          arrival: order.arrival
            ? order.arrival.estimated_time
              ? format.dateTime(
                  new Date(
                    `${order.arrival.estimated_date}T${order.arrival.estimated_time}`
                  ),
                  dateTimeFormatOptions
                )
              : format.dateTime(
                  new Date(order.arrival.estimated_date),
                  dateFormatOptions
                )
            : t('unknown'),
          departure: order.departure
            ? order.departure.estimated_time
              ? format.dateTime(
                  new Date(
                    `${order.departure.estimated_date}T${order.departure.estimated_time}`
                  ),
                  dateTimeFormatOptions
                )
              : format.dateTime(
                  new Date(order.departure.estimated_date),
                  dateFormatOptions
                )
            : t('unknown'),
        })),
    [orderData, t, format]
  );

  const columns: DataTableColumn<OrderRowData>[] = [
    {
      accessor: 'created',
      title: t('created'),
    },
    {
      accessor: 'berth',
      title: t('berth'),
      render: (data) => data.berthing.berth_code,
    },
    {
      accessor: 'vessel',
      title: t('vessel'),
      render: (data) => data.berthing.vessel_name || data.berthing.vessel_imo,
    },
    {
      accessor: 'arrival',
      title: t('arrival'),
    },
    {
      accessor: 'departure',
      title: t('departure'),
    },
    {
      accessor: 'services',
      title: t('services'),
      render: (data) =>
        data.common_services
          .map((service) => service.titles[locale])
          .join(', '),
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
  ];

  return (
    <>
      <Modal
        size="lg"
        opened={editModalOpened}
        onClose={closeEditModal}
        title={t('editOrder')}>
        {selectedRow && (
          <EditOrder
            order={selectedRow}
            onCancel={closeEditModal}
            resultCallback={closeEditModal}
          />
        )}
      </Modal>
      <PaginatedTable<OrderRowData>
        withColumnBorders
        allRecords={orderRowData}
        columns={columns}
      />
    </>
  );
}
