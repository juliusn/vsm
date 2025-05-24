'use client';

import { useDockingDataTableProps } from '@/app/hooks/useDockingDataTableProps';
import { DockingRowData } from '@/lib/types/docking';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { DataTable } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { DeleteDockingConfirmation } from './DeleteDockingConfirmation';
import { useDockingTableColumns } from '../../hooks/useDockingTableColumns';
import { EditDockingForm } from './EditDockingForm';

export function DockingTable() {
  const t = useTranslations('DockingsTable');
  const [selectedRow, setSelectedRow] = useState<DockingRowData | null>(null);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const columns = useDockingTableColumns({
    setSelectedRow,
    openEditModal,
    openDeleteModal,
  });
  const dataTable = useDockingDataTableProps();

  return (
    <>
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title={t('editDocking')}>
        {selectedRow && (
          <EditDockingForm dockingRow={selectedRow} close={closeEditModal} />
        )}
      </Modal>
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title={t('deleteDocking')}>
        {selectedRow && (
          <DeleteDockingConfirmation
            cancel={closeDeleteModal}
            data={selectedRow}
            afterConfirm={closeDeleteModal}
          />
        )}
      </Modal>
      <DataTable {...dataTable} columns={columns} />
    </>
  );
}
