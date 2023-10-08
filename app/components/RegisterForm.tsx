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
import {
  IconCheck,
  IconExclamationCircle,
  IconSquareCheck,
  IconUserPlus,
} from '@tabler/icons-react';
import { usePathname, useRouter } from 'next-intl/client';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

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
  labelSuccess,
  labelError,
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
  labelSuccess: string;
  labelError: string;
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
  const [userNameAvailibilityMessage, setUserNameAvailibilityMessage] =
    useState(null);
  const [
    userNameAvailibilityLoading,
    {
      open: openUserNameAvailibilityLoading,
      close: closeUserNameAvailibilityLoading,
    },
  ] = useDisclosure(false);
  const [loading, { open: openLoading }] = useDisclosure(false);
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

  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const error = searchParams.get('error');
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      <form action="/auth/register" method="post" onSubmit={openLoading}>
        <Stack pos="relative">
          <LoadingOverlay
            visible={loading}
            zIndex={1000}
            overlayProps={{ radius: 'sm', blur: 2 }}
          />
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
            <Box pos="relative">
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
              <LoadingOverlay
                visible={userNameAvailibilityLoading}
                loaderProps={{ size: 'sm' }}
              />
            </Box>
          </div>
          <Button
            variant="outline"
            disabled={!tosComplete || userNameAvailibilityLoading}
            loading={userNameAvailibilityLoading}
            onClick={(event) => {
              event.preventDefault();
              checkUserName();
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
      <Modal
        opened={message !== null}
        onClose={() => deleteParam('message')}
        centered
        styles={{
          title: {
            color: 'var(--mantine-color-green-outline)',
          },
        }}
        title={
          <div className="flex gap-4">
            <IconCheck stroke={1.5} />
            <Text>{labelSuccess}</Text>
          </div>
        }>
        {message}
      </Modal>
      <Modal
        opened={error !== null}
        onClose={() => deleteParam('error')}
        centered
        styles={{
          title: { color: 'var(--mantine-color-red-outline)' },
        }}
        title={
          <div className="flex gap-4">
            <IconExclamationCircle stroke={1.5} />
            <Text>{labelError}</Text>
          </div>
        }>
        <Stack>{error}</Stack>
      </Modal>
    </>
  );

  async function checkUserName() {
    if (form.validateField('userName').hasError) {
      return;
    }
    openUserNameAvailibilityLoading();
    setUserNameAvailable(false);
    setUserNameAvailibilityMessage(null);
    const userName = form.getInputProps('userName').value;
    const response = await fetch(`/auth/check-username/${userName}/`);
    if (response.ok) {
      const { userExists, message } = await response.json();
      setUserNameAvailable(!userExists);
      setUserNameAvailibilityMessage(message);
    } else {
      const { error } = await response.json();
      setUserNameAvailable(false);
      setUserNameAvailibilityMessage(error);
    }
    closeUserNameAvailibilityLoading();
  }

  function deleteParam(param: string) {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  }
}
