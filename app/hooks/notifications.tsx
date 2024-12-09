import { NotificationData } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

export const useErrorNotification = () => {
  const t = useTranslations('ErrorNotification');
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
