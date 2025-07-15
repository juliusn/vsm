'use client';

import { useBerthings } from '@/app/context/BerthingContext';
import { EditOrderFormProvider } from '@/app/context/FormContext';
import { useOrderData } from '@/app/context/OrderContext';
import { useVessels } from '@/app/context/VesselContext';
import {
  useOrderCancelledNotification,
  useOrderSavedNotification,
  useOrderSentNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import useBerthingFormValidation from '@/app/hooks/useBerthingFormValidation';
import { portEventQueryFactory } from '@/lib/portEventQueryFactory';
import { berthingsSelector, ordersSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import {
  BerthIdentifier,
  BerthingFormValues,
  PortAreaIdentifier,
} from '@/lib/types/berthing';
import { OrderFormValues } from '@/lib/types/order';
import { Order } from '@/lib/types/QueryTypes';
import { Button, Group, Modal, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import dayjs from 'dayjs';
import equal from 'fast-deep-equal';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { EditOrderForm } from './EditOrderForm';

interface Props {
  order: Order;
  onClose(): void;
  resultCallback(data: Order): void;
}

type FormValues = BerthingFormValues & OrderFormValues;

export function EditOrder({ order, onClose, resultCallback }: Props) {
  const t = useTranslations('EditOrder');
  const supabase = createClient();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const { dispatchOrderData } = useOrderData();
  const { dispatchBerthings } = useBerthings();
  const vessels = useVessels();
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSavedNotification = useOrderSavedNotification();
  const getOrderCanelledNotification = useOrderCancelledNotification();
  const getOrderSentNotification = useOrderSentNotification();
  const existingServices = order.common_services.map((service) => service.id);
  const [locode, setLocode] = useState(order.berthing.locode || '');
  const imoRef = useRef<HTMLInputElement>(null);
  const berthingValidation = useBerthingFormValidation();

  const vesselMatch = vessels.find(
    (vessel) => vessel.imo === order.berthing.vessel_imo
  );

  const [vessel, setVessel] = useState<AppTypes.Vessel | undefined>(
    vesselMatch
  );

  const arrival = order.berthing.port_events.find(
    (event) => event.type === 'arrival'
  );

  const departure = order.berthing.port_events.find(
    (event) => event.type === 'departure'
  );

  const portAreaIdentifier: PortAreaIdentifier | null =
    order.berthing.locode && order.berthing.port_area_code
      ? {
          locode: order.berthing.locode,
          port_area_code: order.berthing.port_area_code,
        }
      : null;

  const berthIdentifier: BerthIdentifier | null =
    order.berthing.locode &&
    order.berthing.port_area_code &&
    order.berthing.berth_code
      ? {
          locode: order.berthing.locode,
          port_area_code: order.berthing.port_area_code,
          berth_code: order.berthing.berth_code,
        }
      : null;

  const [portArea, setPortArea] = useState(
    portAreaIdentifier ? JSON.stringify(portAreaIdentifier) : ''
  );

  const initialValues: FormValues = {
    sender: order.sender.business_id,
    receiver: order.receiver.business_id,
    vesselName: vesselMatch?.imo.toString() || '',
    imo: order.berthing.vessel_imo || '',
    locode: order.berthing.locode || '',
    portArea: portAreaIdentifier ? JSON.stringify(portAreaIdentifier) : '',
    berth: berthIdentifier ? JSON.stringify(berthIdentifier) : '',
    etaDate: arrival ? dayjs(arrival.estimated_date).toDate() : '',
    etaTime: arrival?.estimated_time ? arrival.estimated_time.slice(0, 5) : '',
    etdDate: departure ? dayjs(departure.estimated_date).toDate() : '',
    etdTime: departure?.estimated_time
      ? departure.estimated_time.slice(0, 5)
      : '',
    berthing: order.berthing.id,
    services: order.common_services.map((service) => service.id),
  };

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues,
    validate: {
      ...berthingValidation,
      berthing: (berthing) => (berthing ? null : t('selectBerthingError')),
      services: (services) =>
        services.length ? null : t('selectServicesError'),
    },
    transformValues: (values) => ({
      ...values,
      vesselName: vessel?.name || '',
      portArea:
        values.portArea &&
        (JSON.parse(values.portArea) as PortAreaIdentifier).port_area_code,
      berth:
        values.berth &&
        (JSON.parse(values.berth) as BerthIdentifier).berth_code,
    }),
    onValuesChange: (values) => {
      const dirty = !equal(
        values.services.sort(),
        initialValues.services.sort()
      );
      form.setDirty({ services: dirty });
    },
  });

  form.watch('vesselName', ({ value }) => {
    if (value) {
      form.setFieldValue('imo', Number(value));
      setTimeout(() => {
        imoRef.current?.select();
      }, 0);
    } else {
      form.setFieldValue('imo', '');
      form.getInputNode('vesselName')?.focus();
    }
  });

  form.watch('imo', ({ value }) => {
    const match = vessels.find((vessel) => vessel.imo === value);
    setVessel(match);
    if (match) {
      form.setFieldValue('vesselName', match.imo.toString());
    }
  });

  form.watch('locode', ({ previousValue, value }) => {
    setLocode(value);
    if (previousValue && previousValue !== value) {
      form.setFieldValue('portArea', '');
      form.setFieldValue('berth', '');
    }
  });

  form.watch('portArea', ({ previousValue, value }) => {
    setPortArea(value);
    if (previousValue && previousValue !== value) {
      form.setFieldValue('berth', '');
    }
    if (value) {
      const { locode }: PortAreaIdentifier = JSON.parse(value);
      form.setFieldValue('locode', locode);
    }
  });

  form.watch('berth', ({ value }) => {
    if (value) {
      const { locode, port_area_code }: BerthIdentifier = JSON.parse(value);
      form.setFieldValue('locode', locode);
      const portArea: PortAreaIdentifier = { locode, port_area_code };
      form.setFieldValue('portArea', JSON.stringify(portArea));
    }
  });

  form.watch('etaDate', () => {
    form.validateField('etaTime');
  });

  form.watch('etaTime', () => {
    form.validateField('etaDate');
  });

  form.watch('etdDate', () => {
    form.validateField('etdTime');
  });

  form.watch('etdTime', () => {
    form.validateField('etdDate');
  });

  const handleSubmit = async ({
    sender,
    receiver,
    vesselName,
    imo,
    locode,
    portArea,
    berth,
    etaDate,
    etaTime,
    etdDate,
    etdTime,
    berthing,
    services,
  }: FormValues) => {
    if (imo === '') return;

    const updateOrderQuery = supabase
      .from('orders')
      .update({ sender, receiver, status: 'submitted' })
      .eq('id', order.id);

    const updateBerthingsQuery = supabase
      .from('berthings')
      .update({
        vessel_imo: imo,
        vessel_name: vesselName || null,
        locode: locode || null,
        port_area_code: portArea || null,
        berth_code: berth || null,
      })
      .eq('id', berthing);

    const arrivalQuery = portEventQueryFactory({
      berthing,
      portEvent: arrival,
      type: 'arrival',
      newValues: { date: etaDate, time: etaTime },
    })?.(supabase);

    const departureQuery = portEventQueryFactory({
      berthing,
      portEvent: departure,
      type: 'departure',
      newValues: { date: etdDate, time: etdTime },
    })?.(supabase);

    const servicesToInsert = services
      .filter((service) => !existingServices.includes(service))
      .map((service) => ({ order: order.id, common_service: service }));

    const servicesToDelete = existingServices.filter(
      (service) => !services.includes(service)
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

    setSubmitLoading(true);

    const updateResponses = await Promise.all([
      updateOrderQuery,
      updateBerthingsQuery,
      arrivalQuery,
      departureQuery,
      insertServicesQuery,
      deleteServicesQuery,
    ]);

    const berthingsQuery = supabase
      .from('berthings')
      .select(berthingsSelector)
      .eq('id', berthing)
      .single();

    const ordersQuery = supabase
      .from('orders')
      .select(ordersSelector)
      .eq('id', order.id)
      .single();

    const [berthingsResponse, ordersResponse] = await Promise.all([
      berthingsQuery,
      ordersQuery,
    ]);

    setSubmitLoading(false);

    if (berthingsResponse.data) {
      dispatchBerthings({ type: 'changed', item: berthingsResponse.data });
    }

    if (ordersResponse.data) {
      const orderData = {
        ...ordersResponse.data,
        common_services: ordersResponse.data.common_services.map((service) => ({
          ...service,
          titles: service.titles as AppTypes.ServiceTitles,
        })),
      };

      dispatchOrderData({
        type: 'changed',
        item: orderData,
      });

      resultCallback(orderData);
    }

    for (const response of [
      ...updateResponses,
      berthingsResponse,
      ordersResponse,
    ]) {
      if (response?.error) {
        showNotification(getErrorNotification(berthingsResponse.status));
        return;
      }
    }

    showNotification(
      order.status !== 'cancelled'
        ? getOrderSavedNotification()
        : getOrderSentNotification()
    );
  };

  const handleCancel = async () => {
    setCancelLoading(true);

    const { data, error, status } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', order.id)
      .select(ordersSelector)
      .single();

    setCancelLoading(false);

    if (error) {
      showNotification(getErrorNotification(status));
      closeCancelModal();
      return;
    }

    dispatchOrderData({ type: 'changed', item: data });
    showNotification(getOrderCanelledNotification());
    closeCancelModal();
    onClose();
  };

  const [
    cancelModalOpened,
    { open: openCancelModal, close: closeCancelModal },
  ] = useDisclosure();

  const cancelOrderContent = (
    <>
      <Modal
        title={t('cancelModalTitle')}
        opened={cancelModalOpened}
        onClose={closeCancelModal}>
        <Stack>
          {t('cancelModalMessage')}
          <Group grow>
            <Button variant="outline" onClick={closeCancelModal}>
              {t('closeButtonLabel')}
            </Button>
            <Button color="red" onClick={handleCancel}>
              {t('confirmButtonLabel')}
            </Button>
          </Group>
        </Stack>
      </Modal>
      <Button
        variant="outline"
        color="red"
        onClick={openCancelModal}
        loading={cancelLoading}>
        {t('cancelButtonLabel')}
      </Button>
    </>
  );

  return (
    <EditOrderFormProvider value={form}>
      <EditOrderForm
        vessel={vessel}
        imoRef={imoRef}
        locode={locode}
        portArea={portArea}
        additionalContent={
          order.status !== 'cancelled' ? cancelOrderContent : null
        }
        status={order.status}
        onClose={onClose}
        onSubmit={form.onSubmit(handleSubmit)}
        loading={submitLoading}
      />
    </EditOrderFormProvider>
  );
}
