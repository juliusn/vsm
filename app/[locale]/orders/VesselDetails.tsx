'use client';

import { Table } from '@mantine/core';
import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from 'next-intl';

export function VesselDetails({ vessel }: { vessel: AppTypes.Vessel }) {
  function parseEta(encodedEta: number): Date | null {
    // Extract each part using bitwise operations
    const month = (encodedEta >> 16) & 0x0f; // Bits 19-16
    const day = (encodedEta >> 11) & 0x1f; // Bits 15-11
    const hour = (encodedEta >> 6) & 0x1f; // Bits 10-6
    const minute = encodedEta & 0x3f; // Bits 5-0

    // Return null if any component is "not available"
    if (month === 0 || day === 0 || hour === 24 || minute === 60) {
      return null;
    }

    // Construct a UTC Date object
    const now = new Date();
    const year = now.getUTCFullYear(); // Use current year for the date
    return new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  }
  const eta = parseEta(vessel.eta);

  const t = useTranslations('VesselDetails');
  const format = useFormatter();
  const formatOptions: DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  const etaLabel = eta
    ? format.dateTime(eta, formatOptions)
    : t('notAvailable');

  return (
    <Table captionSide="top" variant="vertical">
      <Table.Caption>{t('caption')}</Table.Caption>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>{t('name')}</Table.Th>
          <Table.Td>{vessel.name}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('timestamp')}</Table.Th>
          <Table.Td>
            {format.dateTime(new Date(vessel.timestamp), formatOptions)}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('destination')}</Table.Th>
          <Table.Td>{vessel.destination}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('shipType')}</Table.Th>
          <Table.Td>{vessel.shipType}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('mmsi')}</Table.Th>
          <Table.Td>{vessel.mmsi}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('callSign')}</Table.Th>
          <Table.Td>{vessel.callSign}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('imo')}</Table.Th>
          <Table.Td>{vessel.imo}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('draught')}</Table.Th>
          <Table.Td>
            {format.number(vessel.draught / 10, {
              style: 'unit',
              unit: 'meter',
            })}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t('eta')}</Table.Th>
          <Table.Td>{etaLabel}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
}
