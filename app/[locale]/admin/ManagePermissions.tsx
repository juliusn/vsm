'use client';

import { useDefaultCounterparties } from '@/app/context/DefaultCounterpartyContext';
import { useProfiles } from '@/app/context/ProfileContext';
import {
  usePostgresErrorNotification,
  useUserPermissionsUpdatedNotification,
} from '@/app/hooks/notifications';
import {
  PERMISSION_ACTIONS,
  usePermissionLabels,
} from '@/app/hooks/permissionLabels';
import {
  orderPermissionsSelector,
  portEventPermissionsSelector,
} from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/lib/types/query-types';
import { Stack } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useTranslations } from 'use-intl';
import ManagePermissionsSection from './ManagePermissionsSection';
import OrderRelationship from './OrderRelationship';

interface Props {
  profile: Profile;
}

export default function ManagePermissions({ profile }: Props) {
  const t = useTranslations('ManagePermissions');
  const { sender, receiver } = useDefaultCounterparties();
  const supabase = createClient();
  const { dispatchProfiles } = useProfiles();
  const username = `${profile.first_name} ${profile.last_name}`;
  const getUserPermissionsUpdatedNotification =
    useUserPermissionsUpdatedNotification();
  const getErrorNotification = usePostgresErrorNotification();
  const orderPermissionLabels = usePermissionLabels('orders');
  const portEventPermissionLabels = usePermissionLabels('portEvents');
  const currentOrderPermissions = profile.order_permissions
    .filter(
      (orderPermission) =>
        orderPermission.sender.business_id === sender.business_id &&
        orderPermission.receiver.business_id === receiver.business_id
    )
    .map((orderPermission) => orderPermission.permission);
  const currentPortEventPermissions = profile.port_event_permissions.map(
    (portEventPermission) => portEventPermission.permission
  );

  return (
    <Stack>
      <ManagePermissionsSection
        title={t('orderHandling')}
        initialItems={PERMISSION_ACTIONS.map((permission) => ({
          label: orderPermissionLabels[permission],
          checked: currentOrderPermissions.includes(permission),
          key: permission,
        }))}
        username={username}
        handleSave={async (items) => {
          const { data, error, status } = await supabase
            .rpc('replace_order_permissions', {
              p_user_id: profile.id,
              p_sender_business_id: sender.business_id,
              p_receiver_business_id: receiver.business_id,
              p_permissions: items
                .filter((item) => item.checked)
                .map((item) => item.key),
            })
            .select(orderPermissionsSelector);

          if (error) {
            showNotification(getErrorNotification(status));
            return;
          }

          dispatchProfiles({
            type: 'patched',
            id: profile.id,
            changes: { order_permissions: data },
          });
          showNotification(getUserPermissionsUpdatedNotification());
        }}>
        <OrderRelationship sender={sender} receiver={receiver} />
      </ManagePermissionsSection>

      <ManagePermissionsSection
        title={t('portEventsHandling')}
        initialItems={PERMISSION_ACTIONS.map((permission) => ({
          label: portEventPermissionLabels[permission],
          checked: currentPortEventPermissions.includes(permission),
          key: permission,
        }))}
        username={username}
        handleSave={async (items) => {
          const { data, error, status } = await supabase
            .rpc('replace_port_event_permissions', {
              p_user_id: profile.id,
              p_permissions: items
                .filter((item) => item.checked)
                .map((item) => item.key),
            })
            .select(portEventPermissionsSelector);

          if (error) {
            showNotification(getErrorNotification(status));
            return;
          }

          dispatchProfiles({
            type: 'patched',
            id: profile.id,
            changes: { port_event_permissions: data },
          });
          showNotification(getUserPermissionsUpdatedNotification());
        }}></ManagePermissionsSection>
    </Stack>
  );
}
