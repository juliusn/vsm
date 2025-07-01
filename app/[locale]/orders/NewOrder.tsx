'use client';

import { useOrderData } from '@/app/context/OrderContext';
import {
  useOrderSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { ordersSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { OrderForm } from './OrderForm';
import { OrderFormValues } from '@/lib/types/order';

interface Props {
  onCancel(): void;
  resultCallback?(data: AppTypes.OrderData): void;
}

export function NewOrder({ onCancel, resultCallback }: Props) {
  const t = useTranslations('NewOrder');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { dispatchOrderData } = useOrderData();
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSavedNotification = useOrderSavedNotification();

  const form = useForm<OrderFormValues>({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: { berthing: '', services: [] },
    validate: {
      berthing: (berthing) => (berthing ? null : t('selectBerthingError')),
      services: (services) =>
        services.length ? null : t('selectServicesError'),
    },
  });

  const handleSubmit = async ({ berthing, services }: OrderFormValues) => {
    setLoading(true);

    const { data, error, status } = await supabase
      .from('orders')
      .insert({ berthing })
      .select('id')
      .single();

    if (error) {
      showNotification(getErrorNotification(status));
      setLoading(false);
      return;
    }

    const queries = services.map((service) =>
      supabase
        .from('common_service_order')
        .insert({ common_service: service, order: data.id })
    );

    const responses = await Promise.all(queries);

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

    const orderData: AppTypes.OrderData = {
      ...orderResponse.data,
      common_services: orderResponse.data.common_services.map((service) => ({
        ...service,
        titles: service.titles as AppTypes.ServiceTitles,
      })),
    };

    dispatchOrderData({
      type: 'added',
      item: orderData,
    });
    setLoading(false);
    showNotification(getOrderSavedNotification());
    resultCallback?.(orderData);
  };

  return (
    <OrderForm
      form={form}
      onCancel={onCancel}
      onSubmit={form.onSubmit(handleSubmit)}
      loading={loading}
    />
  );
}
