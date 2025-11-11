'use client';

import { Button, Group, Stack, Table, Text } from '@mantine/core';
import { ContextModalProps, modals } from '@mantine/modals';
import { AuthError } from '@supabase/supabase-js';
import { IconCheck, IconExclamationCircle } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import React from 'react';

function ErrorDetails({ error }: { error: AuthError }) {
  const t = useTranslations('ErrorDetails');

  return (
    <details>
      <summary>
        <Text>{t('details')}</Text>
      </summary>
      <Table variant="vertical" withTableBorder>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th>{t('status')}</Table.Th>
            <Table.Td>{error.status || t('noStatus')}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>{t('code')}</Table.Th>
            <Table.Td>{error.code || t('noCode')}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>{t('message')}</Table.Th>
            <Table.Td>{error.message}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </details>
  );
}

function useAuthErrorMessage() {
  const t = useTranslations('useAuthErrorMessage');

  return {
    getAuthErrorMessage: (error: AuthError) => {
      switch (error.status) {
        case 403:
          return t('message403');

        case 422:
          return t('message422');

        case 429:
          return t('message429');

        case 500:
          return t('message500');

        case 501:
          return t('message501');

        default:
          return t('messageDefault');
      }
    },
  };
}

const ErrorModalTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <Group c="red">
      <IconExclamationCircle />
      <Text fw={700}>{children}</Text>
    </Group>
  );
};

const SuccessModalTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <Group c="green">
      <IconCheck stroke={1.5} />
      {children}
    </Group>
  );
};

export const useAuthErrorModal = () => {
  const t = useTranslations('useErrorTitle');
  const { getAuthErrorMessage } = useAuthErrorMessage();

  const showErrorModalWithContent = (content: React.ReactNode) => {
    modals.openContextModal({
      modal: 'modalWithCloseButton',
      title: <ErrorModalTitle>{t('title')}</ErrorModalTitle>,
      innerProps: { content },
    });
  };

  const showErrorModalWithDetails = (error: AuthError) => {
    modals.openContextModal({
      modal: 'modalWithCloseButton',
      title: (
        <ErrorModalTitle>
          {t('title') + (error.status ? ` (${error.status})` : '')}
        </ErrorModalTitle>
      ),
      innerProps: {
        content: (
          <Stack>
            <Text>{getAuthErrorMessage(error)}</Text>
            <ErrorDetails error={error} />
          </Stack>
        ),
      },
    });
  };

  return { showErrorModalWithContent, showErrorModalWithDetails };
};

export const useRegisterErrorModal = () => {
  const t = useTranslations('useRegisterErrorModal');
  const { showErrorModalWithContent, showErrorModalWithDetails } =
    useAuthErrorModal();

  const showRegisterErrorModal = (error: AuthError) => {
    if (error.code === 'invalid_credentials') {
      showErrorModalWithContent(t('userExistsMessage'));
    } else {
      showErrorModalWithDetails(error);
    }
  };

  return { showRegisterErrorModal };
};

export const useLoginErrorModal = () => {
  const t = useTranslations('useLoginErrorModal');
  const { showErrorModalWithContent, showErrorModalWithDetails } =
    useAuthErrorModal();

  const showLoginErrorModal = (error: AuthError) => {
    if (error.code === 'invalid_credentials') {
      showErrorModalWithContent(t('invalidCredentialsMessage'));
    } else {
      showErrorModalWithDetails(error);
    }
  };

  return { showLoginErrorModal };
};

export const useSuccessModal = () => {
  const t = useTranslations('useSuccessTitle');

  const showSuccessModal = ({
    title,
    content,
  }: {
    title?: string;
    content: React.ReactNode;
  }) => {
    modals.openContextModal({
      modal: 'modalWithCloseButton',
      title: <SuccessModalTitle>{title || t('title')}</SuccessModalTitle>,
      innerProps: {
        content,
      },
    });
  };

  return { showSuccessModal };
};

export const ModalWithCloseButton = ({
  context,
  id,
  innerProps: { content },
}: ContextModalProps<{ content: React.ReactNode }>) => {
  const t = useTranslations('ModalWithCloseButton');

  return (
    <Stack>
      {content}
      <Button fullWidth mt="md" onClick={() => context.closeModal(id)}>
        {t('label')}
      </Button>
    </Stack>
  );
};
