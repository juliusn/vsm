import { Alert, Container } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';
import { getTranslations } from 'next-intl/server';

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const t = await getTranslations('ErrorPage');
  const { status, message } = await searchParams;

  return (
    <Container>
      {typeof message === 'string' ? (
        typeof status === 'string' ? (
          <Alert
            variant="outline"
            icon={<IconExclamationCircle />}
            title={t.rich('alertTitleWithError', { status })}
            color="red">
            {t.rich('alertMessageWithError', { message })}
          </Alert>
        ) : (
          <Alert
            variant="outline"
            icon={<IconExclamationCircle />}
            title={t('alertTitle')}
            color="red">
            {t.rich('alertMessageWithError', { message })}
          </Alert>
        )
      ) : (
        <Alert
          variant="outline"
          icon={<IconExclamationCircle />}
          title={t('alertTitle')}
          color="red">
          {t('alertMessage')}
        </Alert>
      )}
    </Container>
  );
}
