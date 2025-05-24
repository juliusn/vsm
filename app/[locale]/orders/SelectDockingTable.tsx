'use client';

import { useDockingDataTableProps } from '@/app/hooks/useDockingDataTableProps';
import { DataTable, DataTableProps } from 'mantine-datatable';
import { useSelectDockingColumns } from '../../hooks/useSelectDockingColumns';
import { DockingRowData } from '@/lib/types/docking';

export function SelectDockingTable(
  props: Partial<DataTableProps<DockingRowData>>
) {
  const columns = useSelectDockingColumns();
  const dockingsProps = useDockingDataTableProps();

  return <DataTable {...dockingsProps} columns={columns} {...props} />;
}
