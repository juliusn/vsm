'use client';

import { ErrorModal } from '@/app/components/ErrorModal';
import { useEmailStore } from '@/app/store';
import { createClient } from '@/lib/supabase/client';
import {
  Button,
  Fieldset,
  Group,
  Modal,
  Stack,
  TextInput,
} from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconMail } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function ResendForm() {
  const t = useTranslations('ResendForm');
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [attemptConsumed, setAttemptConsumed] = useState(false);
  const email = useEmailStore((state) => state.email);

  const [errorModalOpened, { open: openErrorModal, close: closeErrorModal }] =
    useDisclosure(false);

  const [
    successModalOpened,
    { open: openSuccessModal, close: closeSuccessModal },
  ] = useDisclosure(false);

  const form = useForm<{ email: string }>({
    initialValues: {
      email,
    },
    validate: {
      email: isEmail(t('invalidEmail')),
    },
    validateInputOnBlur: true,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email'));
    setLoading(true);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    setLoading(false);
    setAttemptConsumed(true);

    if (error) {
      openErrorModal();
    } else {
      openSuccessModal();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Fieldset disabled={loading || attemptConsumed}>
        <Stack>
          <TextInput
            name="email"
            label={t('email')}
            placeholder={t('email')}
            {...form.getInputProps('email')}></TextInput>
          <Button
            type="submit"
            disabled={!form.isValid()}
            loading={loading}
            leftSection={<IconMail stroke={1.5} />}
            rightSection={<span className="w-6 invisible"></span>}
            justify="space-between"
            className="mt-2"
            styles={{
              label: {
                overflow: 'visible',
              },
            }}>
            {t('submit')}
          </Button>
        </Stack>
      </Fieldset>
      <Modal
        opened={successModalOpened}
        onClose={closeSuccessModal}
        title={
          <Group c="green">
            <IconCheck stroke={1.5} />
            {t('successTitle')}
          </Group>
        }>
        {t('successMessage')}
      </Modal>
      <ErrorModal
        opened={errorModalOpened}
        onClose={closeErrorModal}
        title={t('errorTitle')}>
        {t('errorMessage')}
      </ErrorModal>
    </form>
  );
}
