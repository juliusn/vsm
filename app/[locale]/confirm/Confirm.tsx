'use client';

import { ProgressBarLink } from '@/app/components/ProgressBar';
import { useSessionStore } from '@/app/store';
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
        link: (text) => (
          <ProgressBarLink href="/profile">{text}</ProgressBarLink>
        ),
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
