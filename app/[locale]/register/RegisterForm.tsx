'use client';

import { useProgressBar } from '@/app/components/ProgressBar';
import { useRegisterErrorModal, useSuccessModal } from '@/app/hooks/feedback';
import { createClient } from '@/lib/supabase/client';
import {
  Anchor,
  Button,
  Checkbox,
  Fieldset,
  Modal,
  PasswordInput,
  Stack,
  TextInput,
} from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconSquareCheck, IconUserPlus } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordAgain: string;
  agreeToS: boolean;
}

export function RegisterForm() {
  const t = useTranslations('RegisterForm');
  const supabase = createClient();
  const locale = useLocale();
  const [tosComplete, setTosComplete] = useState<boolean>(false);
  const [formDisabled, setFormDisabled] = useState(false);
  const { showRegisterErrorModal } = useRegisterErrorModal();
  const { showSuccessModal } = useSuccessModal();
  const [tosModalOpened, { open: openTosModal, close: closeTosModal }] =
    useDisclosure(false);
  const progress = useProgressBar();

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
    progress.start();
    const { firstName, lastName, email, password } = form.values;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          locale,
        },
      },
    });

    if (error) {
      showRegisterErrorModal(error);
    } else {
      showSuccessModal({
        title: t('accountCreated'),
        content: t('checkYourEmail'),
      });
      form.reset();
      setFormDisabled(true);
    }

    progress.done();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Fieldset
          variant="unstyled"
          disabled={formDisabled || progress.state === 'in-progress'}>
          <Stack pos="relative">
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
              disabled={!form.isValid()}
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
        size="xl"
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
    </>
  );
}
