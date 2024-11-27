import { ProgressBarLink } from '@/app/components/ProgressBar';
import { Stack } from '@mantine/core';
import { useTranslations } from 'next-intl';

export default function DataPage() {
  const t = useTranslations('DataPage');
  return (
    <Stack>
      <ProgressBarLink href="/data/locations">{t('locations')}</ProgressBarLink>
      <ProgressBarLink href="/data/vessels">{t('vessels')}</ProgressBarLink>
    </Stack>
  );
}
