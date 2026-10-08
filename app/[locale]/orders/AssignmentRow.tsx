'use client';

import { DebouncedNumberInput } from '@/app/components/DebouncedNumberInput';
import DebouncedSwitch from '@/app/components/DebouncedSwitch';
import PortEventIndicator from '@/app/components/PortEventIndicator';
import ServicesGroup from '@/app/components/ServicesGroup';
import { SortableCommonService } from '@/app/context/CommonServiceContext';
import { type PortEventChanges, useOrders } from '@/app/context/OrderContext';
import {
  useOrderSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { useSchedule } from '@/app/hooks/useSchedule';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/lib/types/database.types';
import { WithDictionary } from '@/lib/types/translation';
import {
  ActionIcon,
  Center,
  Group,
  Modal,
  Popover,
  Stack,
  Table,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconInfoCircle, IconUserPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useAssignments } from './AssignmentContext';
import InviteAssigneesTable from './InviteAssigneesTable';

type Props = {
  portEvent: Tables<'port_events'>;
  services: WithDictionary<SortableCommonService>[];
};

type NumberFields = keyof Pick<
  Tables<'port_events'>,
  'default_duration_minutes' | 'default_standby_minutes' | 'max_assignees'
>;

export default function AssignmentRow({
  portEvent: {
    id,
    type,
    berth_code: berth,
    estimated_date: date,
    estimated_time: time,
    default_standby_minutes,
    default_duration_minutes,
    max_assignees,
    is_public,
  },
  services,
}: Props) {
  const t = useTranslations('AssignmentRow');
  const supabase = createClient();
  const { getEstimate, getSchedule, minutesSuffix } = useSchedule();
  const [
    inviteModalOpened,
    { open: openInviteModal, close: closeInviteModal },
  ] = useDisclosure(false);
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSavedNotification = useOrderSavedNotification();
  const { dispatch } = useOrders();
  const { profiles, invitationStatuses } = useAssignments();
  const eventInvitationStatuses = invitationStatuses[id] ?? {};
  const estimate = getEstimate(date, time);
  const schedule = getSchedule(
    date,
    time,
    default_standby_minutes,
    default_duration_minutes
  );

  const portEventsUpdate = async (changes: PortEventChanges) => {
    const { data, error, status } = await supabase
      .from('port_events')
      .update(changes)
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      showNotification(getErrorNotification(status));
      throw error;
    }

    showNotification(getOrderSavedNotification());
    dispatch({ type: 'portEventChanged', id: data.id, changes });
  };

  const onNumberSave = (field: NumberFields) => (value: number) =>
    portEventsUpdate({ [field]: value });

  return (
    <>
      <Modal
        opened={inviteModalOpened}
        onClose={closeInviteModal}
        title={t('inviteAssignees')}
        size="lg">
        <Stack>
          <InviteAssigneesTable
            profiles={profiles}
            invitationStatuses={eventInvitationStatuses}
          />
        </Stack>
      </Modal>

      <Table.Tr>
        <Table.Td>
          <Group wrap="nowrap" justify="space-between">
            <PortEventIndicator type={type} berth={berth} />
            <Popover withArrow shadow="sm">
              <Popover.Target>
                <ActionIcon variant="subtle">
                  <IconInfoCircle stroke={1.5} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <Table withTableBorder>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>{t('estimate')}</Table.Th>
                      <Table.Th>{t('schedule')}</Table.Th>
                      <Table.Th>{t('services')}</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    <Table.Tr>
                      <Table.Td>{estimate}</Table.Td>
                      <Table.Td>{schedule}</Table.Td>
                      <Table.Td>
                        <ServicesGroup services={services} />
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                </Table>
              </Popover.Dropdown>
            </Popover>
          </Group>
        </Table.Td>
        <Table.Td>
          <DebouncedNumberInput
            initialValue={max_assignees}
            allowDecimal={false}
            allowNegative={false}
            inputSize="2"
            onSave={onNumberSave('max_assignees')}
          />
        </Table.Td>
        <Table.Td>
          <DebouncedNumberInput
            initialValue={default_standby_minutes}
            allowDecimal={false}
            allowNegative={false}
            inputSize="6"
            step={5}
            suffix={' ' + minutesSuffix}
            onSave={onNumberSave('default_standby_minutes')}
          />
        </Table.Td>
        <Table.Td>
          <DebouncedNumberInput
            initialValue={default_duration_minutes}
            allowDecimal={false}
            allowNegative={false}
            inputSize="7"
            step={5}
            suffix={' ' + minutesSuffix}
            onSave={onNumberSave('default_duration_minutes')}
          />
        </Table.Td>
        <Table.Td>
          <Center>
            <ActionIcon variant="subtle" onClick={openInviteModal}>
              <IconUserPlus stroke={1.5} />
            </ActionIcon>
          </Center>
        </Table.Td>
        <Table.Td>
          <Center>
            <DebouncedSwitch
              initialValue={is_public}
              onSave={(value) => portEventsUpdate({ is_public: value })}
            />
          </Center>
        </Table.Td>
      </Table.Tr>
    </>
  );
}
