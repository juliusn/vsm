'use client';

import { Table } from '@mantine/core';
import { usePortAreaApi } from './PortAreaApiContext';
import { ProgressBarLink } from '@/app/components/ProgressBar';
import { IncludeCheckbox } from './IncludeCheckbox';
import { usePortAreaDb } from './PortAreaDbContext';

export default function PortAreaRows({ locode }: { locode: string }) {
  const existingPortAreas = usePortAreaApi();
  const selectedPortAreas = usePortAreaDb();
  const portAreaRows = existingPortAreas.map(
    ({ portAreaCode, properties: { portAreaName } }) => (
      <Table.Tr key={portAreaCode}>
        <Table.Td>
          <IncludeCheckbox
            portAreaCode={portAreaCode}
            selected={selectedPortAreas.includes(portAreaCode)}
          />
        </Table.Td>
        <Table.Td>
          <ProgressBarLink href={`/data/port-data/${locode}/${portAreaCode}`}>
            {portAreaCode}
          </ProgressBarLink>
        </Table.Td>
        <Table.Td>{portAreaName}</Table.Td>
      </Table.Tr>
    )
  );
  return <>{portAreaRows}</>;
}
