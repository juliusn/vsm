import type { Enums } from '@/lib/types/database.types';
import { useTranslations } from 'next-intl';

type Permission = Enums<'permission'>;
type PermissionResource = 'orders' | 'portEvents';

export const PERMISSION_ACTIONS = [
  'read',
  'create',
  'edit',
  'delete',
] satisfies Permission[];

export function usePermissionLabels(
  resource: PermissionResource
): Record<Permission, string> {
  const t = useTranslations('PermissionLabels');
  const resourceLabel = t(`resources.${resource}`);

  return {
    read: t('actions.read', { resource: resourceLabel }),
    create: t('actions.create', { resource: resourceLabel }),
    edit: t('actions.edit', { resource: resourceLabel }),
    delete: t('actions.delete', { resource: resourceLabel }),
  };
}
