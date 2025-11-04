import { ProgressBarLink } from '@/app/components/ProgressBar';
import { redirect } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/server';
import { Alert, Container } from '@mantine/core';
import { IconMailCheck } from '@tabler/icons-react';
import { getLocale, getTranslations } from 'next-intl/server';

export default async function WelcomePage() {
  const t = await getTranslations('WelcomePage');
  const supabase = await createClient();
  const locale = await getLocale();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <Container size="24rem">
        <Alert
          variant="outline"
          icon={<IconMailCheck />}
          title={t('alertTitle')}
          color="green">
          {t.rich('alertMessage', {
            name: user.user_metadata.first_name,
            link: (text) => (
              <ProgressBarLink href="/profile">{text}</ProgressBarLink>
            ),
          })}
        </Alert>
      </Container>
    );
  }

  if (error) {
    redirect({
      href: {
        pathname: '/error',
        query: { status: error.status, message: error.message },
      },
      locale,
    });
  }

  redirect({ href: '/error', locale });
}
