'use client';

import { useOrders } from '@/app/context/OrderContext';
import {
  OrderFormProvider,
  useOrderForm,
} from '@/app/context/OrderFormContext';
import {
  useOrderSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { normalizeOrder } from '@/lib/normalizers';
import { ordersSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { TablesUpdate } from '@/lib/types/database.types';
import { OrderData } from '@/lib/types/order';
import { Order } from '@/lib/types/query-types';
import { isNotEmpty, TransformedValues } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { OrderForm } from './OrderForm';

interface Props {
  order: OrderData;
  onCancel(): void;
  resultCallback?(data: Order): void;
}

export function EditOrder({ order, onCancel, resultCallback }: Props) {
  const t = useTranslations('EditOrder');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { dispatchOrders } = useOrders();
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSavedNotification = useOrderSavedNotification();
  const existingServices = order.common_services.map((service) => service.id);

  const initialValues = {
    sender_counterparty_business_id: order.sender.business_id,
    receiver_counterparty_business_id: order.receiver.business_id,
    berthing: order.berthing.id,
    services: order.common_services.map(({ id }) => id).sort(),
  };

  const form = useOrderForm({
    initialValues,
    validate: {
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

  const handleSubmit = async (formValues: TransformedValues<typeof form>) => {
    const { services, ...ordersFormValues } = formValues;
    const ordersFields = Object.keys(ordersFormValues) as Array<
      keyof typeof ordersFormValues
    >;

    const ordersPayload = ordersFields
      .filter((key) => initialValues[key] !== formValues[key])
      .reduce<
        TablesUpdate<'orders'>
      >((payload, key) => ({ ...payload, [key]: formValues[key] }), {});

    const ordersQuery = Object.keys(ordersPayload).length
      ? supabase
          .from('orders')
          .update(ordersPayload)
          .eq('id', order.id)
          .select(ordersSelector)
          .single()
      : supabase
          .from('orders')
          .select(ordersSelector)
          .eq('id', order.id)
          .single();

    const servicesToInsert = formValues.services
      .filter((service) => !existingServices.includes(service))
      .map((service) => ({ order: order.id, common_service: service }));

    const servicesToDelete = existingServices.filter(
      (service) => !formValues.services.includes(service)
    );

    const insertServicesQuery = servicesToInsert.length
      ? supabase.from('common_service_order').insert(servicesToInsert)
      : null;

    const deleteServicesQuery = servicesToDelete.length
      ? supabase
          .from('common_service_order')
          .delete()
          .or(
            servicesToDelete
              .map((id) => `and(order.eq.${order.id},common_service.eq.${id})`)
              .join(',')
          )
      : null;

    setLoading(true);

    const servicesResponses = await Promise.all([
      insertServicesQuery,
      deleteServicesQuery,
    ]);

    for (const response of servicesResponses) {
      if (response?.error) {
        showNotification(getErrorNotification(response.status));
        setLoading(false);
        return;
      }
    }

    const ordersResponse = await ordersQuery;
    setLoading(false);

    if (ordersResponse.error) {
      showNotification(getErrorNotification(ordersResponse.status));
      return;
    }

    const normalized = normalizeOrder(ordersResponse.data);
    if (normalized) dispatchOrders({ type: 'changed', item: normalized });
    resultCallback?.(ordersResponse.data);
    showNotification(getOrderSavedNotification());
  };

  return (
    <OrderFormProvider form={form}>
      <OrderForm
        onClose={onCancel}
        onSubmit={form.onSubmit(handleSubmit)}
        loading={loading}
        submitButtonLabel={t('saveChanges')}
      />
    </OrderFormProvider>
  );
}
