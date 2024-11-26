import { NotificationData } from '@mantine/notifications';
import { IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

export function useErrorNotification() {
  const t = useTranslations('ErrorNotification');
  return useCallback(
    (status: number): NotificationData => ({
      title: t('errorTitle'),
      message: t.rich('errorMessage', {
        status,
      }),
      icon: <IconExclamationMark stroke={1.5} />,
      color: 'red',
    }),
    [t]
  );
}
