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

export function RegisterForm({
  labelReadToS,
  labelAgreedToS,
  tosHeader,
  tos,
  labelAccountType,
  labelUserName,
  placeHolderUserNamePersonal,
  placeHolderUserNameShared,
  labelCheckUserName,
  labelPersonal,
  labelShared,
  labelAgree,
  labelEmail,
  labelPassword,
  labelPasswordAgain,
  labelSubmit,
  labelValidateUserName,
  labelValidateEmail,
  labelValidatePassword,
  labelValidatePasswordAgain,
  labelValidateToS,
}: {
  labelReadToS: string;
  labelAgreedToS: string;
  tosHeader: string;
  tos: string;
  labelAccountType: string;
  labelUserName: string;
  placeHolderUserNamePersonal: string;
  placeHolderUserNameShared: string;
  labelCheckUserName: string;
  labelPersonal: string;
  labelShared: string;
  labelAgree: string;
  labelEmail: string;
  labelPassword: string;
  labelPasswordAgain: string;
  labelSubmit: string;
  labelValidateUserName: string;
  labelValidateEmail: string;
  labelValidatePassword: string;
  labelValidatePasswordAgain: string;
  labelValidateToS: string;
}) {
  interface FormValues {
    userName: string;
    accountType: 'personal' | 'shared';
    email: string;
    password: string;
    passwordAgain: string;
    agreeToS: boolean;
  }
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
      userName: (value) => (value.length > 2 ? null : labelValidateUserName),
      email: (value) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? null
          : labelValidateEmail,
      password: (value) => (value.length >= 8 ? null : labelValidatePassword),
      passwordAgain: (value, values) =>
        value === values.password ? null : labelValidatePasswordAgain,
      agreeToS: () => (tosComplete ? null : labelValidateToS),
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
          <Anchor onClick={openTos}>{labelReadToS}</Anchor>
          <Checkbox
            name="agreedToS"
            checked={tosComplete}
            disabled={!tosComplete}
            label={labelAgreedToS}
            {...form.getInputProps('agreeToS')}
          />
          <div className="flex flex-col">
            <Text size="sm" fw={500} mt={3}>
              {labelAccountType}
            </Text>
            <SegmentedControl
              name="accountType"
              disabled={!tosComplete}
              {...form.getInputProps('accountType')}
              data={[
                {
                  label: labelPersonal,
                  value: 'personal',
                },
                {
                  label: labelShared,
                  value: 'shared',
                },
              ]}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex justify-between">
              <Text size="sm" fw={500} mt={3}>
                {labelUserName}
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
                    ? placeHolderUserNamePersonal
                    : placeHolderUserNameShared
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
            {labelCheckUserName}
          </Button>
          <TextInput
            name="email"
            label={labelEmail}
            placeholder={labelEmail}
            disabled={!tosComplete}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            name="password"
            label={labelPassword}
            placeholder={labelPassword}
            disabled={!tosComplete}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            name="passwordAgain"
            label={labelPasswordAgain}
            placeholder={labelPassword}
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
            {labelSubmit}
          </Button>
        </Stack>
      </form>
      <Modal opened={tosOpened} onClose={closeTos} title={tosHeader}>
        <Stack>
          {tos}
          <Button
            leftSection={<IconSquareCheck stroke={1.5} />}
            rightSection={<span className="w-6"></span>}
            justify="space-between"
            onClick={() => {
              setTosComplete(true);
              closeTos();
            }}>
            {labelAgree}
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
