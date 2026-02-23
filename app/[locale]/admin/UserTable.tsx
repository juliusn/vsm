'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useProfiles } from '@/app/context/ProfileContext';
import {
  approvalStatuses,
  useApprovalStatus,
} from '@/app/hooks/approvalStatus';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { Enums, Tables } from '@/lib/types/database.types';
import { Modal, SelectProps, Switch, SwitchProps } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { sortBy } from 'lodash';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import ApprovalStatusSelect from './ApprovalStatusSelect';
import { useDisclosure } from '@mantine/hooks';
import { AdminStatusChangeConfirmation } from './AdminStatusChangeConfirmation';
import UserPreview from './UserPreview';

type Profile = Tables<'profiles'>;
type OnChange = SelectProps['onChange'];
type AdminStateTransfer = { profile: Profile; admin: boolean };

const isApprovalStatus = (v: string | null): v is Enums<'approval_status'> =>
  typeof v === 'string' && (approvalStatuses as readonly string[]).includes(v);

export default function UserTable() {
  const { profiles, dispatchProfiles } = useProfiles();
  const { approvalStatusColors, approvalStatusSortOrder } = useApprovalStatus();
  const [records, setRecords] = useState(profiles);
  const t = useTranslations('UserTable');
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();

  const [adminStateTransfer, setAdminStateTransfer] =
    useState<AdminStateTransfer | null>(null);

  const [statusUpdatePending, setStatusUpdatePending] = useState<
    Record<string, boolean>
  >({});

  const [adminUpdatePending, setAdminUpdatePending] = useState<
    Record<string, boolean>
  >({});

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Profile>>({
    columnAccessor: 'updated_at',
    direction: 'desc',
  });

  const [
    confirmAdminStatusModalOpened,
    { open: openConfirmAdminStatusModal, close: closeAdminStatusModal },
  ] = useDisclosure(false);

  const onStatusChange =
    (id: string): OnChange =>
    async (value) => {
      if (!isApprovalStatus(value)) return;
      if (statusUpdatePending[id]) return;

      setStatusUpdatePending((others) => ({ ...others, [id]: true }));

      const { data, error, status } = await supabase
        .from('profiles')
        .update({ approval_status: value })
        .eq('id', id)
        .select('*')
        .single();

      setStatusUpdatePending((others) => ({ ...others, [id]: false }));

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      dispatchProfiles({ type: 'changed', item: data });
    };

  const changeAdminState = async (
    { profile, admin }: AdminStateTransfer,
    onComplete: () => void
  ) => {
    const { id } = profile;
    setAdminUpdatePending((others) => ({ ...others, [id]: true }));

    const { data, error, status } = await supabase
      .from('profiles')
      .update({ admin })
      .eq('id', profile.id)
      .select('*')
      .single();

    setAdminUpdatePending((others) => ({ ...others, [id]: false }));
    onComplete();

    if (error) {
      showNotification(getErrorNotification(status));
      return;
    }

    dispatchProfiles({ type: 'changed', item: data });
  };

  const handleAdminSwitchChange =
    (profile: Profile): SwitchProps['onChange'] =>
    (event) => {
      setAdminStateTransfer({ profile, admin: event.currentTarget.checked });
      openConfirmAdminStatusModal();
    };

  const columns: DataTableColumn<Profile>[] = [
    {
      accessor: 'id',
      title: t('id'),
      sortable: true,
    },
    {
      accessor: 'first_name',
      title: t('firstName'),
      sortable: true,
    },
    {
      accessor: 'last_name',
      title: t('lastName'),
      sortable: true,
    },
    {
      accessor: 'approval_status',
      title: t('approvalStatus'),
      sortable: true,
      render: (profile) => (
        <ApprovalStatusSelect
          defaultValue={profile.approval_status}
          value={profile.approval_status}
          onChange={onStatusChange(profile.id)}
          disabled={statusUpdatePending[profile.id]}
          styles={{
            input: {
              color:
                approvalStatusColors[
                  profile.approval_status as Enums<'approval_status'>
                ],
            },
          }}
        />
      ),
    },
    {
      accessor: 'admin',
      title: t('admin'),
      sortable: true,
      render: (profile) => (
        <Switch
          checked={profile.admin}
          onChange={handleAdminSwitchChange(profile)}
          disabled={adminUpdatePending[profile.id]}
        />
      ),
    },
  ];

  useEffect(() => {
    let data: Profile[];

    switch (sortStatus.columnAccessor) {
      case 'updated_at': {
        data = sortBy(profiles, (profile) =>
          profile.updated_at ? new Date(profile.updated_at) : null
        );
        break;
      }
      case 'approval_status': {
        data = sortBy(
          profiles,
          (profile) => approvalStatusSortOrder[profile.approval_status]
        );
        break;
      }
      default: {
        data = sortBy(profiles, sortStatus.columnAccessor);
      }
    }

    setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus, profiles, approvalStatusSortOrder]);

  return (
    <>
      <Modal
        opened={confirmAdminStatusModalOpened}
        onClose={closeAdminStatusModal}>
        {adminStateTransfer && (
          <AdminStatusChangeConfirmation
            admin={adminStateTransfer.admin}
            preview={<UserPreview profile={adminStateTransfer.profile} />}
            cancel={closeAdminStatusModal}
            onConfirm={() => {
              changeAdminState(adminStateTransfer, closeAdminStatusModal);
            }}
            loading={adminUpdatePending[adminStateTransfer.profile.id]}
          />
        )}
      </Modal>
      <PaginatedTable<Profile>
        allRecords={records}
        columns={columns}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        defaultColumnProps={{
          noWrap: true,
        }}
      />
    </>
  );
}
