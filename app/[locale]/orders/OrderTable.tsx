'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useOrderData } from '@/app/context/OrderContext';
import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { DataTableColumn } from 'mantine-datatable';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';

type OrderRowData = AppTypes.OrderData & {
  created: string;
  arrival: string;
  departure: string;
};

export function OrderTable() {
  const t = useTranslations('OrderTable');
  const locale = useLocale() as AppTypes.Locale;
  const format = useFormatter();
  const { orderData } = useOrderData();
  const orderRowData = useMemo(
    () =>
      orderData
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((order) => ({
          ...order,
          created: format.dateTime(
            new Date(order.created_at),
            dateTimeFormatOptions
          ),
          arrival: order.berthing.port_events.find(
            (event) => event.type === 'arrival'
          ),
          departure: order.berthing.port_events.find(
            (event) => event.type === 'departure'
          ),
        }))
        .map((order) => ({
          ...order,
          arrival: order.arrival
            ? order.arrival.estimated_time
              ? format.dateTime(
                  new Date(
                    `${order.arrival.estimated_date}T${order.arrival.estimated_time}`
                  ),
                  dateTimeFormatOptions
                )
              : format.dateTime(
                  new Date(order.arrival.estimated_date),
                  dateFormatOptions
                )
            : t('unknown'),
          departure: order.departure
            ? order.departure.estimated_time
              ? format.dateTime(
                  new Date(
                    `${order.departure.estimated_date}T${order.departure.estimated_time}`
                  ),
                  dateTimeFormatOptions
                )
              : format.dateTime(
                  new Date(order.departure.estimated_date),
                  dateFormatOptions
                )
            : t('unknown'),
        })),
    [orderData, t, format]
  );

  const columns: DataTableColumn<OrderRowData>[] = [
    {
      accessor: 'created',
      title: t('created'),
    },
    {
      accessor: 'berth',
      title: t('berth'),
      render: (data) => data.berthing.berth_code,
    },
    {
      accessor: 'vessel',
      title: t('vessel'),
      render: (data) => data.berthing.vessel_name || data.berthing.vessel_imo,
    },
    {
      accessor: 'arrival',
      title: t('arrival'),
    },
    {
      accessor: 'departure',
      title: t('departure'),
    },
    {
      accessor: 'services',
      title: t('services'),
      render: (data) =>
        data.common_services
          .map((service) => service.titles[locale])
          .join(', '),
    },
  ];

  return (
    <PaginatedTable<OrderRowData> allRecords={orderRowData} columns={columns} />
  );
}
