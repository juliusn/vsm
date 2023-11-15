'use client';

import {
  Anchor,
  Box,
  Button,
  Checkbox,
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
import { IconSquareCheck, IconUserPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { useProfileStore } from '../store';
import { useRouter } from 'next-intl/client';
import { register } from '../actions';
import { useTranslations } from 'next-intl';

interface FormValues {
  userName: string;
  accountType: 'personal' | 'shared';
  email: string;
  password: string;
  passwordAgain: string;
  agreeToS: boolean;
}

export function RegisterForm() {
  const t = useTranslations('RegisterPage');
  const [tosComplete, setTosComplete] = useState(false);
  const [userNameAvailable, setUserNameAvailable] = useState(false);
  const [userNameAvailibilityMessage, setUserNameAvailabilityMessage] =
    useState(null);
  const [
    userNameAvailibilityLoading,
    {
      open: openUserNameAvailibilityLoading,
      close: closeUserNameAvailibilityLoading,
    },
  ] = useDisclosure(false);
  const [loading, { open: openLoading, close: closeLoading }] =
    useDisclosure(false);
  const [tosOpened, { open: openTos, close: closeTos }] = useDisclosure(false);
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
  const router = useRouter();
  const setProfile = useProfileStore((store) => store.setProfile);
  const handleRegister = async (formData: FormData) => {
    const { profile } = await register(formData);
    setProfile(profile);
    closeLoading();
    if (profile) {
      router.push('/profile');
      router.refresh();
    }
  };
  return (
    <>
      <form action={handleRegister} onSubmit={openLoading}>
        <Stack pos="relative">
          <LoadingOverlay visible={loading} overlayProps={{ radius: 'sm' }} />
          <Anchor onClick={openTos}>{t('readToS')}</Anchor>
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
                {userNameAvailibilityMessage}
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
                disabled={!tosComplete || userNameAvailibilityLoading}
                {...form.getInputProps('userName')}
              />
            </Box>
          </div>
          <Button
            variant="outline"
            disabled={!tosComplete || userNameAvailibilityLoading}
            loading={userNameAvailibilityLoading}
            onClick={(event) => {
              event.preventDefault();
              handleCheckUserName();
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
      </form>
      <Modal opened={tosOpened} onClose={closeTos} title={t('tosHeader')}>
        <Stack>
          {t('tos')}
          <Button
            leftSection={<IconSquareCheck stroke={1.5} />}
            rightSection={<span className="w-6"></span>}
            justify="space-between"
            onClick={() => {
              setTosComplete(true);
              closeTos();
            }}>
            {t('agree')}
          </Button>
        </Stack>
      </Modal>
    </>
  );

  async function handleCheckUserName() {
    if (form.validateField('userName').hasError) {
      return;
    }
    openUserNameAvailibilityLoading();
    setUserNameAvailable(false);
    setUserNameAvailabilityMessage(null);
    const userName = form.getInputProps('userName').value;
    const response = await fetch(`/auth/check-username/${userName}/`);
    if (response.ok) {
      const { userExists, message } = await response.json();
      setUserNameAvailable(!userExists);
      setUserNameAvailabilityMessage(message);
    } else {
      const { error } = await response.json();
      setUserNameAvailable(false);
      setUserNameAvailabilityMessage(error);
    }
    closeUserNameAvailibilityLoading();
  }
}
