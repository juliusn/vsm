'use client';

import { useOrders } from '@/app/context/OrderContext';
import {
  OrderFormProvider,
  useOrderForm,
} from '@/app/context/OrderFormContext';
import {
  useOrderSavedNotification,
  usePostgresErrorNotification,
  useOrderRefreshErrorNotification,
} from '@/app/hooks/notifications';
import { normalizeOrder } from '@/lib/normalizers';
import { ordersSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { OrderData } from '@/lib/types/order';
import { isNotEmpty, TransformedValues } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { OrderForm } from './OrderForm';

interface Props {
  order: OrderData;
  onClose(): void;
}

export function EditOrder({ order, onClose }: Props) {
  const t = useTranslations('EditOrder');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const { dispatch } = useOrders();
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSavedNotification = useOrderSavedNotification();
  const getRefreshErrorNotification = useOrderRefreshErrorNotification();

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
    setLoading(true);
    const { error, status } = await supabase.rpc('edit_order', {
      p_order_id: order.id,
      p_sender_business_id: formValues.sender_counterparty_business_id,
      p_receiver_business_id: formValues.receiver_counterparty_business_id,
      p_berthing: formValues.berthing,
      p_service_ids: formValues.services,
    });

    if (error) {
      showNotification(getErrorNotification(status));
      setLoading(false);
      return;
    }

    const ordersResponse = await supabase
      .from('orders')
      .select(ordersSelector)
      .eq('id', order.id)
      .single();
    setLoading(false);

    if (ordersResponse.error) {
      showNotification(getRefreshErrorNotification());
      onClose();
      return;
    }

    const normalized = normalizeOrder(ordersResponse.data);

    if (!normalized) {
      showNotification(getRefreshErrorNotification());
      onClose();
      return;
    }

    dispatch({ type: 'orderChanged', item: normalized });
    onClose();
    showNotification(getOrderSavedNotification());
  };

  return (
    <OrderFormProvider form={form}>
      <OrderForm
        onClose={onClose}
        onSubmit={form.onSubmit(handleSubmit)}
        loading={loading}
        submitButtonLabel={t('saveChanges')}
      />
    </OrderFormProvider>
  );
}
