'use client';

import { ProgressBarLink } from '@/app/components/ProgressBar';
import { Table } from '@mantine/core';
import { useLocation } from '../LocationContext';
import BerthCheckbox from './BerthCheckbox';

export default function BerthRows({
  locode,
  portAreaCode,
}: {
  locode: string;
  portAreaCode: string;
}) {
  const { berths } = useLocation();

  return berths
    ?.filter((berth) => berth.port_area_code === portAreaCode)
    .map(({ berth_code, berth_name, enabled }) => (
      <Table.Tr key={berth_code}>
        <Table.Td>
          <BerthCheckbox berthCode={berth_code} initChecked={enabled} />
        </Table.Td>
        <Table.Td>
          <ProgressBarLink href={`/data/port-data/${locode}/${portAreaCode}`}>
            {portAreaCode}
          </ProgressBarLink>
        </Table.Td>
        <Table.Td>{berth_name}</Table.Td>
      </Table.Tr>
    ));
}
