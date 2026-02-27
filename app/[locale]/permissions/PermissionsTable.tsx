'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { OrderPermission } from '@/lib/types/query-types';
import { Text } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

type Permission = OrderPermission['order_permission'];

export default function PermissionsTable({
  orderPermissions,
}: {
  orderPermissions: OrderPermission[];
}) {
  const t = useTranslations('PermissionsTable');

  const permissionTranslations: { [_ in Permission]: string } = {
    read: t('readOrders'),
    create: t('createOrders'),
    delete: t('deleteOrders'),
    mark_received: t('markOrdersAsReceived'),
    mark_completed: t('markOrdersAsCompleted'),
    mark_canceled: t('markOrdersAsCanceled'),
  };

  const columns: DataTableColumn<OrderPermission>[] = [
    {
      title: t('sender'),
      accessor: 'sender',
      render: ({ sender }) => <Text>{sender.name}</Text>,
    },
    {
      title: t('receiver'),
      accessor: 'receiver',
      render: ({ receiver }) => <Text>{receiver.name}</Text>,
    },
    {
      title: t('permission'),
      accessor: 'order_permission',
      render: ({ order_permission }) =>
        permissionTranslations[order_permission],
    },
  ];

  return (
    <PaginatedTable
      allRecords={orderPermissions}
      columns={columns}
      defaultColumnProps={{
        noWrap: true,
      }}
    />
  );
}
