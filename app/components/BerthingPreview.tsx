'use client';

import { dateFormatOptions, dateTimeFormatOptions } from '@/lib/formatOptions';
import { Berthing } from '@/lib/types/query-types';
import { Table } from '@mantine/core';
import { useFormatter, useTranslations } from 'next-intl';

export function BerthingPreview({ berthing }: { berthing: Berthing }) {
  const t = useTranslations('BerthingTable');
  const format = useFormatter();

  return (
    <Table
      captionSide="top"
      variant="vertical"
      styles={{ th: { backgroundColor: 'transparent' } }}>
      <Table.Caption>{t('berthingDetails')}</Table.Caption>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>{t('created')}</Table.Th>
          <Table.Td>
            {format.dateTime(
              new Date(berthing.created_at),
              dateTimeFormatOptions
            )}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('vesselName')}</Table.Th>
          <Table.Td>{berthing.vessel_name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('vesselImo')}</Table.Th>
          <Table.Td>{berthing.vessel_imo}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('arrival')}</Table.Th>
          <Table.Td>
            {berthing.arrival
              ? berthing.arrival.estimated_time
                ? format.dateTime(
                    new Date(
                      `${berthing.arrival.estimated_date}T${berthing.arrival.estimated_time}`
                    ),
                    dateTimeFormatOptions
                  )
                : format.dateTime(
                    new Date(berthing.arrival.estimated_date),
                    dateFormatOptions
                  )
              : t('unknown')}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('departure')}</Table.Th>
          <Table.Td>
            {berthing.departure
              ? berthing.departure.estimated_time
                ? format.dateTime(
                    new Date(
                      `${berthing.departure.estimated_date}T${berthing.departure.estimated_time}`
                    ),
                    dateTimeFormatOptions
                  )
                : format.dateTime(
                    new Date(berthing.departure.estimated_date),
                    dateFormatOptions
                  )
              : t('unknown')}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
