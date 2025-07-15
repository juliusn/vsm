import { NotificationData } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

export const usePostgresErrorNotification = () => {
  const t = useTranslations('PostgresErrorNotification');
  return useCallback(
    (status: number): NotificationData => ({
      title: t('title'),
      message: t.rich('message', {
        status,
      }),
      icon: <IconExclamationMark stroke={1.5} />,
      color: 'red',
    }),
    [t]
  );
};

export const useServiceDeletedNotification = () => {
  const t = useTranslations('ServiceDeletedNotification');
  return useCallback(
    (): NotificationData => ({
      title: t('title'),
      message: t('message'),
      icon: <IconCheck stroke={1.5} />,
      color: 'green',
    }),
    [t]
  );
};

export const useServiceSavedNotification = () => {
  const t = useTranslations('ServiceSavedNotification');
  return useCallback(
    (): NotificationData => ({
      title: t('title'),
      message: t('message'),
      icon: <IconCheck stroke={1.5} />,
      color: 'green',
    }),
    [t]
  );
};

export const useBerthingSavedNotification = () => {
  const t = useTranslations('BerthingSavedNotification');
  return useCallback(
    (): NotificationData => ({
      title: t('title'),
      message: t('message'),
      icon: <IconCheck stroke={1.5} />,
      color: 'green',
    }),
    [t]
  );
};

export const useBerthingDeletedNotification = () => {
  const t = useTranslations('BerthingDeletedNotification');
  return useCallback(
    (): NotificationData => ({
      title: t('title'),
      message: t('message'),
      icon: <IconCheck stroke={1.5} />,
      color: 'green',
    }),
    [t]
  );
};

export const useOrderSentNotification = () => {
  const t = useTranslations('OrderSentNotification');
  return useCallback(
    (): NotificationData => ({
      title: t('title'),
      message: t('message'),
      icon: <IconCheck stroke={1.5} />,
      color: 'green',
    }),
    [t]
  );
};

export const useOrderSavedNotification = () => {
  const t = useTranslations('OrderSavedNotification');
  return useCallback(
    (): NotificationData => ({
      title: t('title'),
      message: t('message'),
      icon: <IconCheck stroke={1.5} />,
      color: 'green',
    }),
    [t]
  );
};

export const useOrderCancelledNotification = () => {
  const t = useTranslations('OrderCancelledNotification');
  return useCallback(
    (): NotificationData => ({
      title: t('title'),
      message: t('message'),
      icon: <IconCheck stroke={1.5} />,
      color: 'green',
    }),
    [t]
  );
};
