'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { useProfiles } from '@/app/context/ProfileContext';
import {
  APPROVAL_STATUSES,
  useApprovalStatus,
} from '@/app/hooks/approvalStatus';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { profileSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { Enums } from '@/lib/types/database.types';
import { Profile } from '@/lib/types/query-types';
import {
  ActionIcon,
  Center,
  Indicator,
  Modal,
  SelectProps,
  Switch,
  SwitchProps,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconSettings } from '@tabler/icons-react';
import { sortBy } from 'lodash';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { AdminStatusChangeConfirmation } from './AdminStatusChangeConfirmation';
import ApprovalStatusSelect from './ApprovalStatusSelect';
import ManagePermissions from './ManagePermissions';
import UserPreview from './UserPreview';

type OnChange = SelectProps['onChange'];
type AdminStateTransfer = { profile: Profile; admin: boolean };

const isApprovalStatus = (v: string | null): v is Enums<'approval_status'> =>
  typeof v === 'string' && (APPROVAL_STATUSES as readonly string[]).includes(v);

export default function UserTable() {
  const { profiles, dispatchProfiles } = useProfiles();
  const { approvalStatusColors } = useApprovalStatus();
  const t = useTranslations('UserTable');
  const supabase = createClient();
  const getErrorNotification = usePostgresErrorNotification();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedProfile = profiles.find((profile) => selectedId === profile.id);

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

  const records = useMemo(() => {
    let data: Profile[];

    switch (sortStatus.columnAccessor) {
      case 'updated_at': {
        data = sortBy(profiles, (profile) =>
          profile.updated_at ? new Date(profile.updated_at) : null
        );
        break;
      }
      case 'approval_status': {
        data = sortBy(profiles, (profile) =>
          APPROVAL_STATUSES.indexOf(profile.approval_status)
        );
        break;
      }
      default: {
        data = sortBy(profiles, sortStatus.columnAccessor);
      }
    }

    return sortStatus.direction === 'desc' ? data.reverse() : data;
  }, [sortStatus, profiles]);

  const [
    managePermissionsModalOpened,
    { open: openManagePermissionsModal, close: closeManagePermissionsModal },
  ] = useDisclosure(false);

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
        .select(profileSelector)
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
      .select(profileSelector)
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
      accessor: 'manage_permissions',
      title: t('permissions'),
      render: (profile) => (
        <Center>
          <Indicator size="1rem" label={profile.order_permissions.length}>
            <ActionIcon
              variant="subtle"
              onClick={() => {
                setSelectedId(profile.id);
                openManagePermissionsModal();
              }}>
              <IconSettings stroke={1.5} />
            </ActionIcon>
          </Indicator>
        </Center>
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

  return (
    <>
      <Modal
        title={t('managePermissions')}
        opened={managePermissionsModalOpened}
        onClose={closeManagePermissionsModal}
        size="auto">
        {selectedProfile && (
          <ManagePermissions
            profile={selectedProfile}
            onClose={closeManagePermissionsModal}
          />
        )}
      </Modal>
      <Modal
        title={t('confirmAdminStatusChange')}
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
