'use client';

import { ProgressBarLink } from '@/app/components/ProgressBar';
import { Table } from '@mantine/core';
import { PortAreaCheckbox } from './PortAreaCheckbox';
import { useLocation } from './LocationContext';

export default function PortAreaRows({ locode }: { locode: string }) {
  const { portAreas } = useLocation();
  return portAreas?.map(({ port_area_code, port_area_name, enabled }) => (
    <Table.Tr key={port_area_code}>
      <Table.Td>
        <PortAreaCheckbox portAreaCode={port_area_code} selected={enabled} />
      </Table.Td>
      <Table.Td>
        <ProgressBarLink href={`/data/port-data/${locode}/${port_area_code}`}>
          {port_area_code}
        </ProgressBarLink>
      </Table.Td>
      <Table.Td>{port_area_name}</Table.Td>
    </Table.Tr>
  ));
}
