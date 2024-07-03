'use client';

import { useSessionStore } from '@/app/store';
import { Link } from '@/navigation';
import { Alert } from '@mantine/core';
import { IconExclamationCircle, IconMailCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export function Confirm() {
  const params = useSearchParams();
  const code = params.get('code');
  const t = useTranslations('Confirm');
  const profile = useSessionStore((state) => state.session);

  return profile ? (
    <Alert
      variant="outline"
      icon={<IconMailCheck />}
      title={t('successTitle')}
      color="green">
      {t.rich('successMessage', {
        link: (text) => <Link href="/profile">{text}</Link>,
      })}
    </Alert>
  ) : (
    <Alert
      variant="outline"
      icon={<IconExclamationCircle />}
      title={t('warningTitle')}
      color="red">
      {code ? t('authFlowWarningMessage') : t('noCodeWarningMessage')}
    </Alert>
  );
}
