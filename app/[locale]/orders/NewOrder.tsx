'use client';

import { NewOrderFormProvider } from '@/app/context/FormContext';
import { useOrders } from '@/app/context/OrderContext';
import {
  useOrderSentNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { normalizeOrder } from '@/lib/normalizers';
import { ordersSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { OrderFormValues } from '@/lib/types/order';
import { Order } from '@/lib/types/query-types';
import { isNotEmpty, useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { NewOrderForm } from './NewOrderForm';

interface Props {
  onCancel(): void;
  resultCallback?(data: Order): void;
}

export function NewOrder({ onCancel, resultCallback }: Props) {
  const t = useTranslations('NewOrder');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { dispatchOrders } = useOrders();
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSentNotification = useOrderSentNotification();

  const form = useForm<OrderFormValues>({
    mode: 'uncontrolled',
    initialValues: { sender: '', receiver: '', berthing: '', services: [] },
    validate: {
      sender: isNotEmpty(t('selectClientError')),
      receiver: isNotEmpty(t('selectRecipientError')),
      berthing: isNotEmpty(t('selectBerthingError')),
      services: (services) =>
        services.length ? null : t('selectServicesError'),
    },
  });

  const handleSubmit = async ({
    sender,
    receiver,
    berthing,
    services,
  }: OrderFormValues) => {
    setLoading(true);

    const {
      data: newOrder,
      error,
      status,
    } = await supabase
      .from('orders')
      .insert({ sender, receiver, berthing, status: 'submitted' })
      .select('id')
      .single();

    if (error) {
      showNotification(getErrorNotification(status));
      setLoading(false);
      return;
    }

    const serviceQueries = services.map((service) =>
      supabase
        .from('common_service_order')
        .insert({ common_service: service, order: newOrder.id })
    );

    const responses = await Promise.all(serviceQueries);

    for (const response of responses) {
      if (response.error) {
        showNotification(getErrorNotification(response.status));
        setLoading(false);
        return;
      }
    }

    const orderResponse = await supabase
      .from('orders')
      .select(ordersSelector)
      .eq('id', newOrder.id)
      .single();

    if (orderResponse.error) {
      showNotification(getErrorNotification(orderResponse.status));
      setLoading(false);
      return;
    }

    const order = normalizeOrder(orderResponse.data);

    if (!order) {
      showNotification(getErrorNotification(400));
      setLoading(false);
      return;
    }

    dispatchOrders({
      type: 'added',
      item: order,
    });

    setLoading(false);
    showNotification(getOrderSentNotification());
    resultCallback?.(orderResponse.data);
  };

  return (
    <NewOrderFormProvider value={form}>
      <NewOrderForm
        onClose={onCancel}
        onSubmit={form.onSubmit(handleSubmit)}
        loading={loading}
      />
    </NewOrderFormProvider>
  );
}
