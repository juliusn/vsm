'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { AssignmentProfile } from '@/lib/types/query-types';
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Group,
  MultiSelect,
  Text,
  TextInput,
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { sortBy } from 'lodash';
import { DataTableColumn, DataTableSortStatus } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import type { InvitationStatus } from './AssignmentContext';

const statusColors: Record<InvitationStatus, string> = {
  notInvited: 'gray',
  sent: 'blue',
  viewed: 'cyan',
  accepted: 'green',
  declined: 'red',
};

export default function InviteAssigneesTable({
  profiles,
  invitationStatuses,
}: {
  profiles: AssignmentProfile[];
  invitationStatuses: Record<string, InvitationStatus>;
}) {
  const t = useTranslations('InviteAssigneeTable');
  const [firstNameQuery, setFirstNameQuery] = useState('');
  const [lastNameQuery, setLastNameQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<InvitationStatus[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [sortStatus, setSortStatus] = useState<
    DataTableSortStatus<AssignmentProfile>
  >({ columnAccessor: 'first_name', direction: 'asc' });

  const profileRecords = useMemo(() => {
    const normalizedFirstNameQuery = firstNameQuery.toLocaleLowerCase();
    const normalizedLastNameQuery = lastNameQuery.toLocaleLowerCase();

    const filteredProfiles = profiles.filter((profile) => {
      const status = invitationStatuses[profile.id] ?? 'notInvited';

      return (
        (profile.first_name ?? '')
          .toLocaleLowerCase()
          .includes(normalizedFirstNameQuery) &&
        (profile.last_name ?? '')
          .toLocaleLowerCase()
          .includes(normalizedLastNameQuery) &&
        (selectedStatuses.length === 0 || selectedStatuses.includes(status))
      );
    });

    const sortedProfiles = sortBy(filteredProfiles, (profile) =>
      sortStatus.columnAccessor === 'status'
        ? t(invitationStatuses[profile.id] ?? 'notInvited').toLocaleLowerCase()
        : (profile[sortStatus.columnAccessor as keyof AssignmentProfile] ?? '')
            .toString()
            .toLocaleLowerCase()
    );

    return sortStatus.direction === 'desc'
      ? sortedProfiles.reverse()
      : sortedProfiles;
  }, [
    firstNameQuery,
    invitationStatuses,
    lastNameQuery,
    profiles,
    selectedStatuses,
    sortStatus,
    t,
  ]);

  const statusOptions = (Object.keys(statusColors) as InvitationStatus[]).map(
    (status) => ({ value: status, label: t(status) })
  );

  const profileColumns: DataTableColumn<AssignmentProfile>[] = [
    {
      accessor: 'first_name',
      title: t('firstName'),
      sortable: true,
      render: (profile) => (
        <Group gap="xs" wrap="nowrap">
          <Avatar radius="xl" size={28} />
          <Text size="sm">{profile.first_name}</Text>
        </Group>
      ),
      filter: (
        <TextInput
          aria-label={t('firstName')}
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => {
                setFirstNameQuery('');
                setPage(1);
              }}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={firstNameQuery}
          onChange={(event) => {
            setFirstNameQuery(event.currentTarget.value);
            setPage(1);
          }}
        />
      ),
      filtering: firstNameQuery !== '',
    },
    {
      accessor: 'last_name',
      title: t('lastName'),
      sortable: true,
      filter: (
        <TextInput
          aria-label={t('lastName')}
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => {
                setLastNameQuery('');
                setPage(1);
              }}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={lastNameQuery}
          onChange={(event) => {
            setLastNameQuery(event.currentTarget.value);
            setPage(1);
          }}
        />
      ),
      filtering: lastNameQuery !== '',
    },
    {
      accessor: 'status',
      title: t('status'),
      sortable: true,
      render: (profile) => {
        const status = invitationStatuses[profile.id] ?? 'notInvited';
        return (
          <Badge color={statusColors[status]} variant="light">
            {t(status)}
          </Badge>
        );
      },
      filter: (
        <MultiSelect
          aria-label={t('status')}
          data={statusOptions}
          value={selectedStatuses}
          leftSection={<IconSearch size={16} />}
          onChange={(statuses) => {
            setSelectedStatuses(statuses as InvitationStatus[]);
            setPage(1);
          }}
          comboboxProps={{ withinPortal: false }}
          clearable
          searchable
        />
      ),
      filtering: selectedStatuses.length > 0,
      filterPopoverProps: {
        width: 300,
      },
    },
    {
      accessor: 'invite',
      title: '',
      render: (profile) => {
        const status = invitationStatuses[profile.id] ?? 'notInvited';
        return status === 'notInvited' ? (
          <Button size="compact-sm">{t('invite')}</Button>
        ) : (
          <Button size="compact-sm">{t('cancelInvite')}</Button>
        );
      },
    },
  ];

  return (
    <PaginatedTable<AssignmentProfile>
      allRecords={profileRecords}
      currentPage={page}
      onPageChanged={setPage}
      columns={profileColumns}
      sortStatus={sortStatus}
      onSortStatusChange={setSortStatus}
    />
  );
}
