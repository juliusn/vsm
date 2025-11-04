import { Alert, Container, Stack } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';
import ResendForm from './ResendForm';

export default async function ResendPage() {
  const t = await getTranslations('ResendPage');

  return (
    <Container size="24rem">
      <Stack>
        <Alert
          variant="outline"
          icon={<IconExclamationCircle />}
          title={t('alertTitle')}
          color="red">
          {t('alertMessage')}
        </Alert>
        <ResendForm />
      </Stack>
    </Container>
  );
}
