'use client';

import { useOrders } from '@/app/context/OrderContext';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { normalizeOrder } from '@/lib/normalizers';
import { ordersSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { OrderData } from '@/lib/types/order';
import {
  ComboboxItem,
  Group,
  Select,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Status = OrderData['status'];

const statuses: Status[] = ['submitted', 'received', 'completed', 'canceled'];

interface Props {
  orderRow: OrderData;
  disabled: boolean;
}

export default function OrderStatusSelect({ orderRow, disabled }: Props) {
  const t = useTranslations('OrderStatusSelect');
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const shade = colorScheme === 'light' ? 8 : 6;
  const [value, setValue] = useState<string | null>(orderRow.status);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const { dispatchOrders, orderPermissions } = useOrders();

  const scopedPermissions = orderPermissions.filter(
    ({ sender, receiver }) =>
      sender.business_id === orderRow.sender.business_id &&
      receiver.business_id === orderRow.receiver.business_id
  );

  const permissionReceive = scopedPermissions.some(
    (permission) => permission.order_permission === 'mark_received'
  );

  const permissionComplete = scopedPermissions.some(
    (permission) => permission.order_permission === 'mark_completed'
  );

  const permissionCancel = scopedPermissions.some(
    (permission) => permission.order_permission === 'mark_canceled'
  );

  const permissions: { [k in Status]: boolean } = {
    submitted: false,
    received: permissionReceive,
    completed: permissionComplete,
    canceled: permissionCancel,
  };

  const colors: {
    [k in Status]: string;
  } = {
    submitted: theme.colors.yellow[shade],
    received: theme.colors.blue[shade],
    completed: theme.colors.green[shade],
    canceled: theme.colors.gray[shade],
  };

  const data: ComboboxItem[] = statuses.map((status) => ({
    label: t(status),
    value: status,
    disabled: !permissions[status],
  }));

  const handleChange: (
    value: string | null,
    option: ComboboxItem
  ) => void = async (newValue) => {
    const isStatus = (v: string | null): v is Status =>
      typeof v === 'string' && (statuses as readonly string[]).includes(v);

    if (!isStatus(newValue)) return;
    if (newValue === value) return;

    setLoading(true);

    const { data, error, status } = await supabase
      .from('orders')
      .update({ status: newValue })
      .eq('id', orderRow.id)
      .select(ordersSelector)
      .single();

    setLoading(false);

    if (error) {
      showNotification(getErrorNotification(status));
      return;
    }

    const orderData = normalizeOrder(data);

    if (!orderData) {
      showNotification(getErrorNotification(400));
      return;
    }

    dispatchOrders({ type: 'changed', item: orderData });
    setValue(orderData.status);
  };

  return (
    <Select
      data={data}
      defaultValue={orderRow.status}
      disabled={disabled || loading}
      onChange={handleChange}
      allowDeselect={false}
      renderOption={({ option, checked }) => (
        <Group gap="xs">
          {checked && (
            <IconCheck
              stroke={4}
              size={14}
              style={{
                opacity: 0.4,
              }}
            />
          )}
          <Text size="sm" c={colors[option.value as Status]}>
            {option.label}
          </Text>
        </Group>
      )}
      styles={{
        wrapper: {
          minWidth: '9rem',
          maxWidth: '11rem',
        },
        input: {
          color: colors[value as Status],
        },
      }}
      comboboxProps={{
        width: 'auto',
        position: 'bottom-start',
      }}
    />
  );
}
