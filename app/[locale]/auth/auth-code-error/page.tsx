import { Alert } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function page() {
  return <AuthCodeError />;
}

function AuthCodeError() {
  const t = useTranslations('AuthCodeError');
  return (
    <Alert
      variant="outline"
      icon={<IconExclamationCircle />}
      title={t('title')}
      color="red">
      {t('message')}
    </Alert>
  );
}
