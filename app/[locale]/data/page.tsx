import { ProgressBarLink } from '@/app/components/ProgressBar';
import { useTranslations } from 'next-intl';

export default function DataPage() {
  const t = useTranslations('Data');
  return (
    <>
      <ProgressBarLink href="/data/ports">
        {t('portsAndBerths')}
      </ProgressBarLink>
      <ProgressBarLink href="/data/vessels">{t('vessels')}</ProgressBarLink>
    </>
  );
}
