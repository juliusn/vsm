import { ProgressBarLink } from '@/app/components/ProgressBar';
import { Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function DataPage() {
  const t = useTranslations('Data');
  return (
    <Stack>
      <ProgressBarLink href="/data/ports">
        {t('portsAndBerths')}
      </ProgressBarLink>
      <ProgressBarLink href="/data/vessels">{t('vessels')}</ProgressBarLink>
    </Stack>
  );
}
