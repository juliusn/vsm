import { Enums } from '@/lib/types/database.types';
import { useTranslations } from 'next-intl';

type Permission = Enums<'order_permission'>;

const MODEL: Record<Permission, number> = {
  read: 0,
  create: 1,
  edit: 2,
  delete: 3,
};

export const ORDER_PERMISSIONS = (Object.keys(MODEL) as Permission[]).sort(
  (a, b) => MODEL[a] - MODEL[b]
);

export const useOrderPermissions = () => {
  const t = useTranslations('useOrderPermissions');

  const permissionTranslations: { [_ in Permission]: string } = {
    read: t('read'),
    create: t('create'),
    edit: t('edit'),
    delete: t('delete'),
  };

  return { permissionTranslations };
};
