'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { usePermissionLabels } from '@/app/hooks/permissionLabels';
import { OrderPermission } from '@/lib/types/query-types';
import { Text } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

export function OrderPermissionsTable({
  orderPermissions,
}: {
  orderPermissions: OrderPermission[];
}) {
  const t = useTranslations('PermissionsTable');
  const orderPermissionLabels = usePermissionLabels('orders');

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
      accessor: 'permission',
      render: ({ permission }) => orderPermissionLabels[permission],
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
