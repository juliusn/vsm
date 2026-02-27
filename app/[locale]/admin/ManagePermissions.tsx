'use client';

import { useDefaultCounterparties } from '@/app/context/DefaultCounterpartyContext';
import { useProfiles } from '@/app/context/ProfileContext';
import {
  usePostgresErrorNotification,
  useUserPermissionsUpdatedNotification,
} from '@/app/hooks/notifications';
import { orderPermissionsSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { Enums, TablesInsert } from '@/lib/types/database.types';
import { OrderPermission, Profile } from '@/lib/types/query-types';
import {
  Button,
  Checkbox,
  Divider,
  Fieldset,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { useTranslations } from 'use-intl';
import OrderRelationship from './OrderRelationship';

const permissionsModel: Record<Enums<'order_permission'>, true> = {
  create: true,
  read: true,
  delete: true,
  mark_received: true,
  mark_completed: true,
  mark_canceled: true,
};

type Permission = OrderPermission['order_permission'];

const permissions = Object.keys(permissionsModel) as Permission[];

interface Props {
  profile: Profile;
  onClose(): void;
}

export default function ManagePermissions({ profile, onClose }: Props) {
  const t = useTranslations('ManagePermissions');
  const { sender, receiver } = useDefaultCounterparties();
  const supabase = createClient();
  const [updateIsPending, setUpdateIsPending] = useState(false);
  const { dispatchProfiles } = useProfiles();

  const getUserPermissionsUpdatedNotification =
    useUserPermissionsUpdatedNotification();

  const getErrorNotification = usePostgresErrorNotification();

  const permissionTranslations: { [_ in Permission]: string } = {
    read: t('readOrders'),
    create: t('createOrders'),
    delete: t('deleteOrders'),
    mark_received: t('markOrdersAsReceived'),
    mark_completed: t('markOrdersAsCompleted'),
    mark_canceled: t('markOrdersAsCanceled'),
  };

  const currentPermissions = profile.order_permissions.map(
    (permission) => permission.order_permission
  );

  const initialItems = permissions.map((permission) => ({
    label: permissionTranslations[permission],
    checked: currentPermissions.includes(permission),
    key: permission,
  }));

  const [items, handlers] = useListState(initialItems);
  const allChecked = items.every((item) => item.checked);
  const indeterminate = items.some((item) => item.checked) && !allChecked;

  const unchanged = items.every(
    (item, index) => initialItems[index].checked === item.checked
  );

  const handleReset = () => {
    handlers.setState(initialItems);
  };

  const handleSave = async () => {
    setUpdateIsPending(true);
    const [deleteResponse, insertResponse] = await Promise.all([
      supabase.from('order_permissions').delete().eq('user_id', profile.id),
      supabase
        .from('order_permissions')
        .insert(
          items
            .filter((item) => item.checked)
            .map(
              (item): TablesInsert<'order_permissions'> => ({
                user_id: profile.id,
                order_permission: item.key,
                sender_counterparty_business_id: sender.business_id,
                receiver_counterparty_business_id: receiver.business_id,
              })
            )
        )
        .select(orderPermissionsSelector)
        .eq('user_id', profile.id),
    ]);

    if (deleteResponse.error) {
      showNotification(getErrorNotification(deleteResponse.status));
      setUpdateIsPending(false);
      return;
    }

    if (insertResponse.error) {
      showNotification(getErrorNotification(insertResponse.status));
      setUpdateIsPending(false);
      return;
    }

    setUpdateIsPending(false);
    dispatchProfiles({
      type: 'changed',
      item: { ...profile, order_permissions: insertResponse.data },
    });
    showNotification(getUserPermissionsUpdatedNotification());
  };

  return (
    <Fieldset disabled={updateIsPending}>
      <Stack>
        <Title size="h4">{t('title')}</Title>
        <OrderRelationship sender={sender} receiver={receiver} />
        <Divider />
        <Table>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>
                <Checkbox
                  variant="outline"
                  checked={allChecked}
                  indeterminate={indeterminate}
                  onChange={() =>
                    handlers.setState((current) =>
                      current.map((item) => ({
                        ...item,
                        checked: !allChecked,
                      }))
                    )
                  }
                />
              </Table.Td>
              <Table.Td>
                <Text c="dimmed">{t('user')}</Text>
                <Text
                  fw={700}>{`${profile.first_name} ${profile.last_name}`}</Text>
              </Table.Td>
              <Table.Td></Table.Td>
            </Table.Tr>
            {items.map((item, index) => (
              <Table.Tr key={item.key}>
                <Table.Td>
                  <Checkbox
                    checked={item.checked}
                    onChange={(event) => {
                      handlers.setItemProp(
                        index,
                        'checked',
                        event.currentTarget.checked
                      );
                    }}
                  />
                </Table.Td>
                <Table.Td>
                  <Text flex={1}>{item.label}</Text>
                </Table.Td>
                <Table.Td></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
        <Group grow>
          <Button variant="outline" onClick={onClose}>
            {t('close')}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={unchanged}>
            {t('reset')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={unchanged}
            loading={updateIsPending}>
            {t('save')}
          </Button>
        </Group>
      </Stack>
    </Fieldset>
  );
}
