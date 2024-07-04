import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  return <Link href="/settings/update-password">{t('changePassword')}</Link>;
}
