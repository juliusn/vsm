import { useTranslations } from 'next-intl';
import { ProgressBarLink } from '@/app/components/ProgressBar';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  return (
    <>
      <ProgressBarLink href="/settings/update-password">
        {t('changePassword')}
      </ProgressBarLink>
      <ProgressBarLink href="/settings/delete-account">
        {t('deleteAccount')}
      </ProgressBarLink>
    </>
  );
}
