'use client';

import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { DockingRowData } from '@/lib/types/docking';
import { Table } from '@mantine/core';
import { useFormatter, useTranslations } from 'next-intl';

export function DockingPreview({ data }: { data: DockingRowData }) {
  const t = useTranslations('DockingsTable');
  const format = useFormatter();

  return (
    <Table
      captionSide="top"
      variant="vertical"
      styles={{ th: { backgroundColor: 'transparent' } }}>
      <Table.Caption>{t('dockingDetails')}</Table.Caption>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>{t('created')}</Table.Th>
          <Table.Td>
            {format.dateTime(new Date(data.created_at), dateTimeFormatOptions)}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('vesselName')}</Table.Th>
          <Table.Td>{data.vessel_name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('vesselImo')}</Table.Th>
          <Table.Td>{data.vessel_imo}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('berth')}</Table.Th>
          <Table.Td>{data.berth_code}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('arrival')}</Table.Th>
          <Table.Td>
            {data.arrival
              ? data.arrival.estimated_time
                ? format.dateTime(
                    new Date(
                      `${data.arrival.estimated_date}T${data.arrival.estimated_time}`
                    ),
                    dateTimeFormatOptions
                  )
                : format.dateTime(
                    new Date(data.arrival.estimated_date),
                    dateFormatOptions
                  )
              : t('unknown')}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('departure')}</Table.Th>
          <Table.Td>
            {data.departure
              ? data.departure.estimated_time
                ? format.dateTime(
                    new Date(
                      `${data.departure.estimated_date}T${data.departure.estimated_time}`
                    ),
                    dateTimeFormatOptions
                  )
                : format.dateTime(
                    new Date(data.departure.estimated_date),
                    dateFormatOptions
                  )
              : t('unknown')}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
