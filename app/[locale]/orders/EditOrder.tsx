'use client';

import { useOrderData } from '@/app/context/OrderContext';
import {
  useOrderSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { ordersQuery } from '@/lib/queries';
import { createClient } from '@/lib/supabase/client';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { OrderFormValues } from './NewOrder';
import { OrderForm } from './OrderForm';
import { OrderRowData } from './OrderTable';

interface Props {
  order: OrderRowData;
  onCancel(): void;
  resultCallback(data: AppTypes.OrderData): void;
}

export function EditOrder({ order, onCancel, resultCallback }: Props) {
  const t = useTranslations('EditOrder');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { dispatchOrderData } = useOrderData();
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSavedNotification = useOrderSavedNotification();
  const existingServices = order.common_services.map((service) => service.id);

  const form = useForm<OrderFormValues>({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      berthing: order.berthing.id,
      services: existingServices,
    },
    validate: {
      berthing: (berthing) => (berthing ? null : t('selectBerthingError')),
      services: (services) =>
        services.length ? null : t('selectServicesError'),
    },
  });

  const handleSubmit = async ({ services }: OrderFormValues) => {
    setLoading(true);

    const servicesToInsert = services
      .filter((service) => !existingServices.includes(service))
      .map((service) => ({ order: order.id, common_service: service }));

    const servicesToDelete = existingServices.filter(
      (service) => !services.includes(service)
    );

    const insertQuery = servicesToInsert.length
      ? supabase.from('common_service_order').insert(servicesToInsert)
      : null;

    const deleteQuery = servicesToDelete.length
      ? supabase
          .from('common_service_order')
          .delete()
          .or(
            servicesToDelete
              .map((id) => `and(order.eq.${order.id},common_service.eq.${id})`)
              .join(',')
          )
      : null;

    const [insertResponse, deleteResponse] = await Promise.all([
      insertQuery,
      deleteQuery,
    ]);

    const orderResponse = await supabase
      .from('orders')
      .select(ordersQuery)
      .eq('id', order.id)
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
      type: 'changed',
      item: orderData,
    });

    setLoading(false);

    if (insertResponse && insertResponse.error) {
      showNotification(getErrorNotification(insertResponse.status));
      return;
    }

    if (deleteResponse && deleteResponse.error) {
      showNotification(getErrorNotification(deleteResponse.status));
      return;
    }

    showNotification(getOrderSavedNotification());
    resultCallback(orderData);
  };

  return (
    <OrderForm
      form={form}
      onEditBerthing={(berthing: AppTypes.Berthing) => {
        dispatchOrderData({ type: 'changed', item: { ...order, berthing } });
      }}
      onCancel={onCancel}
      onSubmit={form.onSubmit(handleSubmit)}
      loading={loading}
    />
  );
}
