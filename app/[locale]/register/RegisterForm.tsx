'use client';

import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Fieldset,
  Group,
  LoadingOverlay,
  Modal,
  PasswordInput,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import {
  IconCheck,
  IconExclamationMark,
  IconSquareCheck,
  IconUserPlus,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { showNotification } from '@mantine/notifications';
import { createClient } from '@/lib/supabase/client';
import { ErrorModal } from '@/app/components/ErrorModal';

interface FormValues {
  userName: string;
  accountType: 'personal' | 'shared';
  email: string;
  password: string;
  passwordAgain: string;
  agreeToS: boolean;
}

export function RegisterForm() {
  const t = useTranslations('Register');
  const supabase = createClient();
  const locale = useLocale();
  const [tosComplete, setTosComplete] = useState<boolean>(false);
  const [userNameAvailable, setUserNameAvailable] = useState(false);
  const [userNameAvailabilityMessage, setUserNameAvailabilityMessage] =
    useState<string | null>(null);
  const [formDisabled, setFormDisabled] = useState(false);
  const [
    accountCreatedModalOpened,
    { open: openAccountCreatedModal, close: closeAccountCreatedModal },
  ] = useDisclosure(false);
  const [tosModalOpened, { open: openTosModal, close: closeTosModal }] =
    useDisclosure(false);
  const [errorModalOpened, { open: openErrorModal, close: closeErrorModal }] =
    useDisclosure(false);
  const [
    userNameAvailabilityLoading,
    { open: startUserNameLoading, close: stopUserNameLoading },
  ] = useDisclosure(false);
  const [loading, { open: openLoading, close: closeLoading }] =
    useDisclosure(false);

  const form = useForm<FormValues>({
    initialValues: {
      userName: '',
      accountType: 'personal',
      email: '',
      password: '',
      passwordAgain: '',
      agreeToS: false,
    },
    validate: {
      userName: (value) => (value.length > 2 ? null : t('validate.userName')),
      email: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? null
          : t('validate.email'),
      password: (value) => (value.length >= 8 ? null : t('validate.password')),
      passwordAgain: (value, values) =>
        value === values.password ? null : t('validate.passwordAgain'),
      agreeToS: () => (tosComplete ? null : t('validate.tos')),
    },
    validateInputOnBlur: true,
  });

  async function handleCheckUserName() {
    if (form.validateField('userName').hasError) {
      return;
    }
    startUserNameLoading();
    setUserNameAvailable(false);
    setUserNameAvailabilityMessage(null);
    const userName = form.getInputProps('userName').value;
    const response = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('user_name', userName);

    if (response.error) {
      setUserNameAvailable(false);
      showNotification({
        title: t('error'),
        message: t('checkUserNameError'),
        icon: <IconExclamationMark stroke={1.5} />,
        color: 'red',
      });
    }

    const userNameIsAvailable = response.count === 0;
    setUserNameAvailable(userNameIsAvailable);
    const message = userNameIsAvailable ? t('available') : t('notAvailable');
    setUserNameAvailabilityMessage(message);
    stopUserNameLoading();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    openLoading();
    const { email, password, accountType, userName } = form.values;
    const redirectUrl = new URL(`/${locale}/confirm`, window.location.origin);

    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl.href,
        data: {
          account_type: accountType,
          user_name: userName,
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
            <div className="flex flex-col">
              <Text size="sm" fw={500} mt={3}>
                {t('accountType')}
              </Text>
              <SegmentedControl
                name="accountType"
                disabled={!tosComplete}
                {...form.getInputProps('accountType')}
                data={[
                  {
                    label: t('personal'),
                    value: 'personal',
                  },
                  {
                    label: t('shared'),
                    value: 'shared',
                  },
                ]}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <Text size="sm" fw={500} mt={3}>
                  {t('userName')}
                </Text>
                <Text
                  size="sm"
                  fw={500}
                  mt={3}
                  c={userNameAvailable ? 'green' : 'red'}>
                  {userNameAvailabilityMessage}
                </Text>
              </div>
              <Box>
                <TextInput
                  name="userName"
                  placeholder={
                    form.values.accountType === 'personal'
                      ? t('placeHolderUserNamePersonal')
                      : t('placeHolderUserNameShared')
                  }
                  disabled={!tosComplete || userNameAvailabilityLoading}
                  {...form.getInputProps('userName')}
                  onChange={(event) => {
                    setUserNameAvailabilityMessage(null);
                    form.setFieldValue('userName', event.target.value);
                  }}
                />
              </Box>
            </div>
            <Button
              variant="outline"
              disabled={!tosComplete || userNameAvailabilityLoading}
              loading={userNameAvailabilityLoading}
              onClick={handleCheckUserName}
              styles={{
                label: {
                  overflow: 'visible',
                },
              }}>
              {t('checkUserName')}
            </Button>
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
