'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useOrderPermissions } from '@/app/hooks/orderPermissions';
import { OrderPermission } from '@/lib/types/query-types';
import { Text } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useTranslations } from 'next-intl';

export default function PermissionsTable({
  orderPermissions,
}: {
  orderPermissions: OrderPermission[];
}) {
  const t = useTranslations('PermissionsTable');
  const { permissionTranslations } = useOrderPermissions();

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
