'use client';

import { useBerthServices } from '@/app/context/BerthServiceContext';
import { usePostgresErrorNotification } from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { createContext, useContext, useState, useTransition } from 'react';

interface Props {
  showEditModal: (service: AppTypes.BerthService) => void;
}

const Context = createContext<Props | null>(null);

export function EditServiceModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('EditServiceModalProvider');
  const titleLabels: Record<AppTypes.Locale, string> = {
    en: t('titleInputLabelEn'),
    fi: t('titleInputLabelFi'),
  };
  const getErrorNotification = usePostgresErrorNotification();
  const { dispatch } = useBerthServices();
  const [service, setService] = useState<AppTypes.BerthService | null>(null);
  const [enValue, setEnValue] = useState<string>('');
  const [fiValue, setFiValue] = useState<string>('');
  const [updateIsPending, startUpdate] = useTransition();
  const [opened, { open, close }] = useDisclosure(false);
  const supabase = createClient();

  const submitUpdate: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (!service) {
      return;
    }

    startUpdate(async () => {
      const { data, error, status } = await supabase
        .from('berth_services')
        .update({ titles: { en: enValue, fi: fiValue } })
        .eq('id', service.id)
        .select()
        .single();

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      dispatch({
        type: 'changed',
        item: { ...data, titles: data.titles as AppTypes.ServiceTitles },
      });

      showNotification({
        title: t('successTitle'),
        message: t('successMessage'),
        icon: <IconCheck stroke={1.5} />,
        color: 'green',
      });

      close();
    });
  };

  const showEditModal = (service: AppTypes.BerthService) => {
    setService(service);
    setEnValue(service.titles.en);
    setFiValue(service.titles.fi);
    open();
  };

  return (
    <Context.Provider value={{ showEditModal }}>
      {children}
      <Modal opened={opened} onClose={close} title={t('modalTitle')}>
        <form onSubmit={submitUpdate}>
          <Stack>
            <TextInput
              required
              label={titleLabels['en']}
              value={enValue}
              onChange={(event) => setEnValue(event.currentTarget.value)}
            />
            <TextInput
              required
              label={titleLabels['fi']}
              value={fiValue}
              onChange={(event) => setFiValue(event.currentTarget.value)}
            />
            <Group grow>
              <Button variant="outline" onClick={close}>
                {t('cancelButtonLabel')}
              </Button>
              <Button type="submit" loading={updateIsPending}>
                {t('saveButtonLabel')}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Context.Provider>
  );
}

export const useEditServiceModal = (): Props => {
  const context = useContext(Context);
  if (context === null)
    throw new Error(
      'useEditServiceModal must be used within EditServiceModalProvider.'
    );
  return context;
};
