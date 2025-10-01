'use client';

import { OrderStatus } from '@/app/components/OrderStatus';
import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useOrders } from '@/app/context/OrderContext';
import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { OrderRowData } from '@/lib/types/order';
import { ActionIcon, Center, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { EditOrder } from './EditOrder';

export function OrderTable() {
  const t = useTranslations('OrderTable');
  const locale = useLocale() as AppTypes.Locale;
  const format = useFormatter();
  const { orders } = useOrders();
  const [selectedRow, setSelectedRow] = useState<OrderRowData | null>(null);

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const orderRowData = useMemo(
    () =>
      orders
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
    [orders, t, format]
  );

  const columns: DataTableColumn<OrderRowData>[] = [
    {
      accessor: 'created',
      title: t('created'),
    },
    {
      accessor: 'berth',
      title: t('berth'),
      render: (orderRow) => orderRow.berthing.berth_code,
    },
    {
      accessor: 'vessel',
      title: t('vessel'),
      render: (orderRow) =>
        orderRow.berthing.vessel_name || orderRow.berthing.vessel_imo,
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
      render: (orderRow) =>
        orderRow.common_services
          .map((service) => service.dictionary[locale].title)
          .join(', '),
    },
    {
      accessor: 'status',
      title: t('status'),
      noWrap: true,
      render: (orderRow) => <OrderStatus status={orderRow.status} />,
    },
    {
      accessor: 'edit',
      title: t('edit'),
      render: (orderRow) => (
        <Center>
          <ActionIcon
            variant="subtle"
            disabled={orderRow.status === 'completed'}
            onClick={() => {
              setSelectedRow(orderRow);
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
            onClose={closeEditModal}
            resultCallback={closeEditModal}
          />
        )}
      </Modal>
      <PaginatedTable<OrderRowData>
        allRecords={orderRowData}
        columns={columns}
      />
    </>
  );
}
