import { Title } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { UpdatePasswordForm } from './UpdatePasswordForm';

export default async function UpdatePasswordPage() {
  return <UpdatePasswordContent />;
}

function UpdatePasswordContent() {
  const t = useTranslations('UpdatePassword');

  return (
    <>
      <Title size="h5">{t('title')}</Title>
      <UpdatePasswordForm />
    </>
  );
}
