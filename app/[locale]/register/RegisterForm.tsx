'use client';

import {
  Anchor,
  Button,
  Checkbox,
  Fieldset,
  Group,
  LoadingOverlay,
  Modal,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconCheck, IconSquareCheck, IconUserPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { ErrorModal } from '@/app/components/ErrorModal';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordAgain: string;
  agreeToS: boolean;
}

export function RegisterForm() {
  const t = useTranslations('Register');
  const supabase = createClient();
  const [tosComplete, setTosComplete] = useState<boolean>(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const [
    accountCreatedModalOpened,
    { open: openAccountCreatedModal, close: closeAccountCreatedModal },
  ] = useDisclosure(false);
  const [tosModalOpened, { open: openTosModal, close: closeTosModal }] =
    useDisclosure(false);
  const [errorModalOpened, { open: openErrorModal, close: closeErrorModal }] =
    useDisclosure(false);

  const [loading, { open: openLoading, close: closeLoading }] =
    useDisclosure(false);

  const form = useForm<FormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordAgain: '',
      agreeToS: false,
    },
    validate: {
      firstName: isNotEmpty(t('validate.required')),
      lastName: isNotEmpty(t('validate.required')),
      email: isEmail(t('validate.email')),
      password: (value) => (value.length >= 8 ? null : t('validate.password')),
      passwordAgain: (value, values) =>
        value === values.password ? null : t('validate.passwordAgain'),
      agreeToS: () => (tosComplete ? null : t('validate.tos')),
    },
    validateInputOnBlur: true,
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openLoading();
    const { firstName, lastName, email, password } = form.values;

    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (response.error) {
      openErrorModal();
    } else {
      openAccountCreatedModal();
      setFormDisabled(true);
    }
    closeLoading();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Fieldset variant="unstyled" disabled={formDisabled || loading}>
          <Stack pos="relative">
            <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm' }} />
            <Anchor onClick={openTosModal}>{t('readToS')}</Anchor>
            <Checkbox
              name="agreedToS"
              checked={tosComplete}
              disabled={!tosComplete}
              label={t('agreedToS')}
              {...form.getInputProps('agreeToS')}
            />
            <TextInput
              name="firstName"
              label={t('firstName')}
              disabled={!tosComplete}
              {...form.getInputProps('firstName')}
            />
            <TextInput
              name="lastName"
              label={t('lastName')}
              disabled={!tosComplete}
              {...form.getInputProps('lastName')}
            />
            <TextInput
              name="email"
              label={t('email')}
              placeholder={t('email')}
              disabled={!tosComplete}
              {...form.getInputProps('email')}
            />
            <PasswordInput
              name="password"
              label={t('password')}
              placeholder={t('password')}
              disabled={!tosComplete}
              {...form.getInputProps('password')}
            />
            <PasswordInput
              name="passwordAgain"
              label={t('passwordAgain')}
              placeholder={t('password')}
              disabled={!tosComplete}
              {...form.getInputProps('passwordAgain')}
            />
            <Button
              type="submit"
              disabled={!form.isValid() || loading}
              leftSection={<IconUserPlus stroke={1.5} />}
              rightSection={<span className="w-6"></span>}
              justify="space-between"
              className="mt-2">
              {t('submit')}
            </Button>
          </Stack>
        </Fieldset>
      </form>
      <Modal
        opened={tosModalOpened}
        onClose={closeTosModal}
        title={t('tosHeader')}>
        <Stack>
          {t('tos')}
          <Button
            leftSection={<IconSquareCheck stroke={1.5} />}
            rightSection={<span className="w-6"></span>}
            justify="space-between"
            onClick={() => {
              setTosComplete(true);
              closeTosModal();
            }}>
            {t('agree')}
          </Button>
        </Stack>
      </Modal>
      <Modal
        opened={accountCreatedModalOpened}
        onClose={closeAccountCreatedModal}
        title={
          <Group c="green">
            <IconCheck stroke={1.5} />
            {t('accountCreated')}
          </Group>
        }>
        {t('checkYourEmail')}
      </Modal>
      <ErrorModal
        opened={errorModalOpened}
        onClose={closeErrorModal}
        title={t('error')}>
        {t('signupError')}
      </ErrorModal>
    </>
  );
}
