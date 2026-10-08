'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import ServicesGroup from '@/app/components/ServicesGroup';
import { useOrders } from '@/app/context/OrderContext';
import { dateTimeFormatOptions } from '@/lib/formatOptions';
import { Enums } from '@/lib/types/database.types';
import { OrderData } from '@/lib/types/order';
import { ActionIcon, Center, Modal, ScrollArea, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconUserPlus } from '@tabler/icons-react';
import { sortBy } from 'lodash';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useFormatter, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import AssignmentsTable from '../AssignmentsTable';
import { EditOrder } from '../EditOrder';
import OrderStatusSelect from '../OrderStatusSelect';
import classes from './OrderTable.module.css';

const statusRank: Record<Enums<'order_status'>, number> = {
  submitted: 0,
  received: 1,
  completed: 2,
  canceled: 3,
};

export function OrderTable() {
  const t = useTranslations('OrderTable');
  const format = useFormatter();
  const { orders, orderPermissions } = useOrders();
  const [selectedOrderId, setSelectedOrderId] = useState<
    OrderData['id'] | null
  >(null);
  const selectedRow = selectedOrderId
    ? (orders.find((order) => order.id === selectedOrderId) ?? null)
    : null;

  const canEditOrder = (order: OrderData) =>
    orderPermissions.some(
      (permission) =>
        permission.order_permission === 'edit' &&
        order.sender.business_id === permission.sender.business_id &&
        order.receiver.business_id === permission.receiver.business_id
    );

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const [
    assignmentsModalOpened,
    { open: openAssignmentsModal, close: closeAssignmentsModal },
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
        <ServicesGroup services={orderRow.common_services} />
      ),
      width: '0%',
    },
    {
      accessor: 'status',
      title: t('status'),
      render: (orderRow) => (
        <OrderStatusSelect
          orderRow={orderRow}
          disabled={!canEditOrder(orderRow)}
        />
      ),
      sortable: true,
    },
    {
      accessor: 'assignments',
      title: t('assignments'),
      render: (orderRow) => (
        <Center>
          <ActionIcon
            variant="subtle"
            disabled={orderRow.status !== 'received' || !canEditOrder(orderRow)}
            onClick={() => {
              setSelectedOrderId(orderRow.id);
              openAssignmentsModal();
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
            disabled={!canEditOrder(orderRow)}
            onClick={() => {
              setSelectedOrderId(orderRow.id);
              openEditModal();
            }}>
            <IconEdit stroke={1.5} />
          </ActionIcon>
        </Center>
      ),
    },
  ];

  const records = useMemo(() => {
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

    return sortStatus.direction === 'desc' ? data.reverse() : data;
  }, [orders, sortStatus]);

  return (
    <>
      <Modal
        size="lg"
        opened={editModalOpened}
        onClose={closeEditModal}
        title={t('editOrder')}>
        {selectedRow && (
          <EditOrder order={selectedRow} onClose={closeEditModal} />
        )}
      </Modal>
      <Modal
        size="xxl"
        opened={assignmentsModalOpened}
        onClose={closeAssignmentsModal}
        title={
          selectedRow?.berthing.vessel_name ??
          selectedRow?.berthing.vessel_imo.toString()
        }>
        {selectedRow && (
          <ScrollArea>
            <AssignmentsTable order={selectedRow} />
          </ScrollArea>
        )}
      </Modal>
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
