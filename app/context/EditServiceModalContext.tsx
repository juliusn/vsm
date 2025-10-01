'use client';

import { TranslationWithAbbreviation } from '@/lib/types/translation';
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useState } from 'react';

type OnSave = (
  translationEn: TranslationWithAbbreviation,
  translationFi: TranslationWithAbbreviation
) => Promise<void>;

interface ModalProps {
  title: string;
  translationEn: TranslationWithAbbreviation;
  translationFi: TranslationWithAbbreviation;
  onSave: OnSave;
}

interface ContextProps {
  openEditModal: (props: ModalProps) => void;
  closeEditModal: () => void;
}

const Context = createContext<ContextProps | null>(null);

export function EditServiceModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('EditServiceModalProvider');
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [onSave, setOnSave] = useState<OnSave | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [titleEn, setTitleEn] = useState<string>('');
  const [abbrvEn, setAbbrvEn] = useState<string>('');
  const [titleFi, setTitleFi] = useState<string>('');
  const [abbrvFi, setAbbrvFi] = useState<string>('');

  const translationEn: TranslationWithAbbreviation = {
    locale: 'en',
    title: titleEn,
    abbreviation: abbrvEn,
  };

  const translationFi: TranslationWithAbbreviation = {
    locale: 'fi',
    title: titleFi,
    abbreviation: abbrvFi,
  };

  const openModal = ({
    title,
    translationEn,
    translationFi,
    onSave,
  }: ModalProps) => {
    setModalTitle(title);
    setTitleEn(translationEn.title);
    setAbbrvEn(translationEn.abbreviation);
    setTitleFi(translationFi.title);
    setAbbrvFi(translationFi.abbreviation);
    setOnSave(() => onSave);
    open();
  };

  return (
    <Context.Provider
      value={{
        openEditModal: openModal,
        closeEditModal: close,
      }}>
      {children}
      <Modal opened={opened} onClose={close} title={modalTitle}>
        <form
          onSubmit={async (event) => {
            event.preventDefault();

            if (onSave === null) {
              return;
            }

            setLoading(true);

            await onSave(translationEn, translationFi);

            setLoading(false);
          }}>
          <Stack>
            <TextInput
              required
              label={t('titleEnInputLabel')}
              value={titleEn}
              onChange={(event) => setTitleEn(event.currentTarget.value)}
            />
            <TextInput
              required
              label={t('abbrvEnInputLabel')}
              value={abbrvEn}
              onChange={(event) =>
                setAbbrvEn(event.currentTarget.value.slice(0, 3).toUpperCase())
              }
            />
            <TextInput
              required
              label={t('titleFiInputLabel')}
              value={titleFi}
              onChange={(event) => setTitleFi(event.currentTarget.value)}
            />
            <TextInput
              required
              label={t('abbrvFiInputLabel')}
              value={abbrvFi}
              onChange={(event) =>
                setAbbrvFi(event.currentTarget.value.slice(0, 3).toUpperCase())
              }
            />
            <Group grow>
              <Button variant="outline" onClick={close}>
                {t('cancelButtonLabel')}
              </Button>
              <Button type="submit" loading={loading}>
                {t('saveButtonLabel')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Context.Provider>
  );
}

export const useEditServiceModal = (): ContextProps => {
  const context = useContext(Context);
  if (context === null)
    throw new Error(
      'useEditServiceModal must be used within a EditServiceModalProvider.'
    );
  return context;
};
