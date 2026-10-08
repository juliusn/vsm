'use client';

import { Tables } from '@/lib/types/database.types';
import { OrderData } from '@/lib/types/order';
import { Table } from '@mantine/core';
import { useTranslations } from 'next-intl';
import AssignmentRow from './AssignmentRow';

export default function AssignmentsTable({ order }: { order: OrderData }) {
  const t = useTranslations('AssignmentsTable');
  const portEvents: Tables<'port_events'>[] = [];
  const { arrival, departure } = order.berthing;
  const shiftings = order.berthing.shiftings;

  if (arrival) {
    portEvents.push(arrival);
  }

  shiftings.forEach((shifting) => {
    portEvents.push(shifting.port_event);
  });

  if (departure) {
    portEvents.push(departure);
  }

  return (
    <Table withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>{t('event')}</Table.Th>
          <Table.Th>{t('assignees')}</Table.Th>
          <Table.Th>{t('standby')}</Table.Th>
          <Table.Th>{t('duration')}</Table.Th>
          <Table.Th>{t('invite')}</Table.Th>
          <Table.Th>{t('publish')}</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {portEvents.map((event) => (
          <AssignmentRow
            key={event.id}
            portEvent={event}
            services={order.common_services.filter(
              (service) => service.port_event === event.type
            )}
          />
        ))}
      </Table.Tbody>
    </Table>
  );
}
