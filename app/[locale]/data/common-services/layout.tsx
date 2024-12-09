import { ProgressBarAnchor } from '@/app/components/ProgressBar';
import { getTranslations } from 'next-intl/server';

export default async function CommonServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('CommonServicesLayout');

  return (
    <>
      <ProgressBarAnchor href={'/data'}>{t('dataMenu')}</ProgressBarAnchor>{' '}
      {children}
    </>
  );
}
