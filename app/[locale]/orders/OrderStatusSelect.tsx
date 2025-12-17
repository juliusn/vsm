'use client';

import { useOrders } from '@/app/context/OrderContext';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { normalizeOrder } from '@/lib/normalizers';
import { ordersSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { OrderRowData } from '@/lib/types/order';
import {
  ComboboxItem,
  Group,
  MantineColorsTuple,
  Select,
  Text,
  useMantineTheme,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Status = OrderRowData['status'];

const statuses: Status[] = ['submitted', 'received', 'completed', 'canceled'];

export default function OrderStatusSelect({
  orderRow,
}: {
  orderRow: OrderRowData;
}) {
  const t = useTranslations('OrderStatusSelect');
  const theme = useMantineTheme();
  const [value, setValue] = useState<string | null>(orderRow.status);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const { dispatchOrders } = useOrders();

  const colors: {
    [k in Status]: MantineColorsTuple;
  } = {
    submitted: theme.colors.yellow,
    received: theme.colors.blue,
    completed: theme.colors.green,
    canceled: theme.colors.gray,
  };

  const data: ComboboxItem[] = statuses.map((status) => ({
    label: t(status),
    value: status,
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
      disabled={loading}
      onChange={handleChange}
      allowDeselect={false}
      renderOption={({ option, checked }) => (
        <Group gap="xs">
          {checked && (
            <IconCheck
              stroke={4}
              size={14}
              style={{
                color: 'currentColor',
                opacity: 0.4,
              }}
            />
          )}
          <Text size="sm" c={colors[option.value as Status][5]}>
            {option.label}
          </Text>
        </Group>
      )}
      styles={{
        input: {
          color: value ? colors[value as Status][5] : theme.primaryColor,
          minWidth: '75px',
        },
      }}
      comboboxProps={{
        width: 'auto',
        position: 'bottom-start',
      }}
    />
  );
}
