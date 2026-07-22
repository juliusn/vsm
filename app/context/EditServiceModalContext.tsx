'use client';

import { Enums, Tables } from '@/lib/types/database.types';
import { TranslationWithAbbreviation } from '@/lib/types/translation';
import {
  Button,
  ComboboxItem,
  Group,
  Modal,
  Select,
  Stack,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useMemo, useState } from 'react';

const PORT_EVENTS_MODEL: Record<Enums<'port_event'>, number> = {
  arrival: 0,
  departure: 1,
  shifting: 2,
};

const PORT_EVENTS = (
  Object.keys(PORT_EVENTS_MODEL) as Enums<'port_event'>[]
).sort((a, b) => PORT_EVENTS_MODEL[a] - PORT_EVENTS_MODEL[b]);

const isPortEvent = (value: string | null): value is Enums<'port_event'> =>
  value !== null && (PORT_EVENTS as readonly string[]).includes(value);

type OnSave = (
  translationEn: TranslationWithAbbreviation,
  translationFi: TranslationWithAbbreviation,
  portEvent: Tables<'common_services'>['port_event']
) => Promise<void>;

interface ModalProps {
  title: string;
  translationEn: TranslationWithAbbreviation;
  translationFi: TranslationWithAbbreviation;
  portEvent: Tables<'common_services'>['port_event'];
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

  const [portEvent, setPortEvent] =
    useState<Tables<'common_services'>['port_event']>(null);

  const portEventLabels: Record<Enums<'port_event'>, string> = useMemo(
    () => ({
      arrival: t('arrival'),
      departure: t('departure'),
      shifting: t('shifting'),
    }),
    [t]
  );

  const portEventSelectData: ComboboxItem[] = PORT_EVENTS.map((portEvent) => ({
    value: portEvent,
    label: portEventLabels[portEvent],
  }));

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
    portEvent,
    onSave,
  }: ModalProps) => {
    setModalTitle(title);
    setTitleEn(translationEn.title);
    setAbbrvEn(translationEn.abbreviation);
    setTitleFi(translationFi.title);
    setAbbrvFi(translationFi.abbreviation);
    setPortEvent(portEvent);
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

            try {
              await onSave(translationEn, translationFi, portEvent);
            } finally {
              setLoading(false);
            }
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
            <Select
              label={t('portEventInputLabel')}
              data={portEventSelectData}
              value={portEvent}
              onChange={(value) => {
                if (value === null) {
                  setPortEvent(null);
                  return;
                }

                if (!isPortEvent(value)) return;

                setPortEvent(value);
              }}
              clearable
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
