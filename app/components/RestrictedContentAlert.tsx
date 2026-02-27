'use client';

import { Alert, Container } from '@mantine/core';
import { IconBan } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

export default function RestrictedContentAlert() {
  const t = useTranslations('RestrictedContentAlert');

  return (
    <Container size="24rem">
      <Alert
        variant="outline"
        color="red"
        title={t('title')}
        icon={<IconBan />}>
        {t('message')}
      </Alert>
    </Container>
  );
}
