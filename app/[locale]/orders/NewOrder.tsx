'use client';

import { useOrders } from '@/app/context/OrderContext';
import {
  OrderFormProvider,
  useOrderForm,
} from '@/app/context/OrderFormContext';
import {
  useOrderSentNotification,
  usePostgresErrorNotification,
  useOrderRefreshErrorNotification,
} from '@/app/hooks/notifications';
import { normalizeOrder } from '@/lib/normalizers';
import { ordersSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { Order } from '@/lib/types/query-types';
import { isNotEmpty, TransformedValues } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { OrderForm } from './OrderForm';

interface Props {
  onCancel(): void;
  onSaved?(data: Order): void;
}

export function NewOrder({ onCancel, onSaved }: Props) {
  const t = useTranslations('NewOrder');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { dispatch, orderPermissions } = useOrders();
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSentNotification = useOrderSentNotification();
  const getRefreshErrorNotification = useOrderRefreshErrorNotification();

  const createOrderPermissions = orderPermissions.filter(
    (orderPermission) => orderPermission.permission === 'create'
  );

  const initialValues = {
    sender_counterparty_business_id:
      createOrderPermissions.length === 1
        ? createOrderPermissions[0].sender.business_id
        : null,
    receiver_counterparty_business_id:
      createOrderPermissions.length === 1
        ? createOrderPermissions[0].receiver.business_id
        : null,
    berthing: null,
    services: [],
  };

  const form = useOrderForm({
    mode: 'uncontrolled',
    initialValues,
    validate: {
      sender_counterparty_business_id: isNotEmpty(t('selectClientError')),
      receiver_counterparty_business_id: isNotEmpty(t('selectRecipientError')),
      berthing: isNotEmpty(t('selectBerthingError')),
      services: (services) =>
        services.length ? null : t('selectServicesError'),
    },
    transformValues: (values) => ({
      sender_counterparty_business_id: values.sender_counterparty_business_id!,
      receiver_counterparty_business_id:
        values.receiver_counterparty_business_id!,
      berthing: values.berthing!,
      services: values.services,
    }),
  });

  const handleSubmit = async ({
    sender_counterparty_business_id,
    receiver_counterparty_business_id,
    berthing,
    services,
  }: TransformedValues<typeof form>) => {
    setLoading(true);

    const {
      data: orderId,
      error,
      status,
    } = await supabase.rpc('create_order', {
      p_sender_business_id: sender_counterparty_business_id,
      p_receiver_business_id: receiver_counterparty_business_id,
      p_berthing: berthing,
      p_service_ids: services,
    });

    if (error) {
      showNotification(getErrorNotification(status));
      setLoading(false);
      return;
    }

    const orderResponse = await supabase
      .from('orders')
      .select(ordersSelector)
      .eq('id', orderId)
      .single();

    if (orderResponse.error) {
      showNotification(getRefreshErrorNotification());
      setLoading(false);
      onCancel();
      return;
    }

    const order = normalizeOrder(orderResponse.data);

    if (!order) {
      showNotification(getRefreshErrorNotification());
      setLoading(false);
      onCancel();
      return;
    }

    dispatch({
      type: 'orderAdded',
      item: order,
    });

    setLoading(false);
    showNotification(getOrderSentNotification());
    onSaved?.(orderResponse.data);
  };

  return (
    <OrderFormProvider form={form}>
      <OrderForm
        onClose={onCancel}
        onSubmit={form.onSubmit(handleSubmit)}
        loading={loading}
        submitButtonLabel={t('sendOrder')}
      />
    </OrderFormProvider>
  );
}
