'use client';

import { NewOrderFormProvider } from '@/app/context/FormContext';
import { useOrderData } from '@/app/context/OrderContext';
import {
  useOrderSentNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { ordersSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { OrderFormValues } from '@/lib/types/order';
import { Order } from '@/lib/types/QueryTypes';
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
  const { dispatchOrderData } = useOrderData();
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

    const { data, error, status } = await supabase
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
        .insert({ common_service: service, order: data.id })
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
      .eq('id', data.id)
      .single();

    if (orderResponse.error) {
      showNotification(getErrorNotification(orderResponse.status));
      setLoading(false);
      return;
    }

    dispatchOrderData({
      type: 'added',
      item: orderResponse.data,
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
