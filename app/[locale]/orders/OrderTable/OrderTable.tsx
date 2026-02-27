'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useOrders } from '@/app/context/OrderContext';
import { dateTimeFormatOptions } from '@/lib/formatOptions';
import { Enums } from '@/lib/types/database.types';
import { OrderData } from '@/lib/types/order';
import { ActionIcon, Badge, Center, Group, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconUserPlus } from '@tabler/icons-react';
import { sortBy } from 'lodash';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { EditOrder } from '../EditOrder';
import OrderStatusSelect from '../OrderStatusSelect';
import classes from './OrderTable.module.css';

const statusRank: Record<Enums<'order_status'>, number> = {
  submitted: 0,
  received: 1,
  completed: 2,
  canceled: 3,
};

const statusPermissions: Enums<'order_permission'>[] = [
  'mark_received',
  'mark_completed',
  'mark_canceled',
];

export function OrderTable() {
  const t = useTranslations('OrderTable');
  const locale = useLocale();
  const format = useFormatter();
  const { orders, orderPermissions } = useOrders();
  const [records, setRecords] = useState(orders);
  const [selectedRow, setSelectedRow] = useState<OrderData | null>(null);

  const permissions = orderPermissions.map(
    (permission) => permission.order_permission
  );

  const canChangeOrderStatus = permissions.some((permission) =>
    statusPermissions.includes(permission)
  );

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const [
    assignModalOpened,
    { open: openAssignModal, close: closeAssignModal },
  ] = useDisclosure(false);

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<OrderData>>({
    columnAccessor: 'created_at',
    direction: 'desc',
  });

  const columns: DataTableColumn<OrderData>[] = [
    {
      accessor: 'created_at',
      title: t('created'),
      render: ({ created_at }) =>
        format.dateTime(new Date(created_at), dateTimeFormatOptions),
      sortable: true,
    },
    {
      accessor: 'berthing',
      title: t('berthing'),
      render: ({ berthing }) => (
        <Text inherit truncate="end" className={classes.berthing}>
          {berthing.vessel_name ?? berthing.vessel_imo}
        </Text>
      ),
    },
    {
      accessor: 'services',
      title: t('services'),
      render: (orderRow) => (
        <Group gap={4}>
          {orderRow.common_services
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((service) => (
              <Badge
                key={service.id}
                variant="default"
                styles={{ root: { flexShrink: 0 } }}>
                {service.dictionary[locale].abbreviation}
              </Badge>
            ))}
        </Group>
      ),
      width: '0%',
    },
    {
      accessor: 'status',
      title: t('status'),
      render: (orderRow) => (
        <OrderStatusSelect
          orderRow={orderRow}
          disabled={canChangeOrderStatus}
        />
      ),
      sortable: true,
    },
    {
      accessor: 'assign',
      title: t('resource'),
      render: (orderRow) => (
        <Center>
          <ActionIcon
            variant="subtle"
            disabled={orderRow.status !== 'received'}
            onClick={() => {
              setSelectedRow(orderRow);
              openAssignModal();
            }}>
            <IconUserPlus stroke={1.5} />
          </ActionIcon>
        </Center>
      ),
    },
    {
      accessor: 'edit',
      title: t('edit'),
      render: (orderRow) => (
        <Center>
          <ActionIcon
            variant="subtle"
            disabled={orderRow.status === 'canceled'}
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

  useEffect(() => {
    let data: OrderData[];
    switch (sortStatus.columnAccessor) {
      case 'created_at': {
        data = sortBy(orders, (order) => new Date(order.created_at));
        break;
      }
      case 'status': {
        data = sortBy(orders, (order) => statusRank[order.status]);
        break;
      }
      default: {
        data = sortBy(orders, sortStatus.columnAccessor);
      }
    }
    setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus, orders]);

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
      <Modal
        size="lg"
        opened={assignModalOpened}
        onClose={closeAssignModal}
        title={t('resource')}></Modal>
      <PaginatedTable<OrderData>
        allRecords={records}
        columns={columns}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        defaultColumnProps={{ noWrap: true }}
      />
    </>
  );
}
