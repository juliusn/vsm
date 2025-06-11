'use client';

import { DockingPreview } from '@/app/components/DockingPreview';
import { useCommonServices } from '@/app/context/CommonServiceContext';
import {
  useOrderSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { DockingRowData } from '@/lib/types/docking';
import {
  Button,
  Checkbox,
  Collapse,
  Fieldset,
  Group,
  InputWrapper,
  Modal,
  Paper,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconAnchor, IconChecklist } from '@tabler/icons-react';
import 'dayjs/locale/fi';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { NewDockingForm } from '../port-traffic/NewDockingForm';
import { SelectDockingTable } from './SelectDockingTable';

type NewOrderValues = {
  docking: string;
  services: string[];
};

export function NewOrderForm({ close }: { close(): void }) {
  const t = useTranslations('NewOrderForm');
  const locale = useLocale() as AppTypes.Locale;
  const supabase = createClient();
  const [docking, setDocking] = useState<DockingRowData | null>(null);
  const [preview, setPreview] = useState<DockingRowData | null>(null);
  const [loading, setLoading] = useState(false);
  const { commonServices } = useCommonServices();
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSavedNotification = useOrderSavedNotification();

  const [
    selectDockingOpened,
    { open: openSelectDocking, close: closeSelectDocking },
  ] = useDisclosure();

  const [newDockingOpened, { open: openNewDocking, close: closeNewDocking }] =
    useDisclosure();

  const form = useForm<NewOrderValues>({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: { docking: '', services: [] },
    validate: {
      docking: (docking) => (docking ? null : t('selectDockingError')),
      services: (services) =>
        services.length ? null : t('selectServicesError'),
    },
  });

  const handleSubmit = async ({ docking, services }: NewOrderValues) => {
    setLoading(true);

    const { data, error, status } = await supabase
      .from('orders')
      .insert({ docking })
      .select()
      .single();

    if (error) {
      showNotification(getErrorNotification(status));
      setLoading(false);
      return;
    }

    const queries = services.map((service) =>
      supabase
        .from('common_service_order')
        .insert({ common_service: service, order: data.id })
    );

    const responses = await Promise.all(queries);

    for (const response of responses) {
      if (response.error) {
        showNotification(getErrorNotification(response.status));
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    showNotification(getOrderSavedNotification());
    close();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Modal
        size="auto"
        opened={selectDockingOpened}
        onClose={closeSelectDocking}
        title={t('selectDocking')}>
        <SelectDockingTable
          onRowClick={({ record }) => {
            setDocking(record);
            setPreview(record);
            form.setFieldValue('docking', record.id);
            form.setFieldValue('services', []);
            closeSelectDocking();
          }}
        />
      </Modal>
      <Modal
        opened={newDockingOpened}
        onClose={closeNewDocking}
        title={t('createNewDocking')}>
        <NewDockingForm
          close={closeNewDocking}
          resultCallback={(data) => {
            setDocking(data);
            setPreview(data);
            form.setFieldValue('services', []);
          }}
        />
      </Modal>
      <Stack>
        <InputWrapper
          required
          {...form.getInputProps('docking')}
          key={form.key('docking')}>
          <Fieldset
            legend={
              <Group>
                <IconAnchor size={20} color="var(--mantine-color-blue-5)" />
                <Text>{t('docking')}</Text>
              </Group>
            }>
            <Stack>
              <Group grow>
                <Button
                  variant="outline"
                  onClick={() => {
                    openNewDocking();
                  }}>
                  {t('create')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    openSelectDocking();
                  }}>
                  {t('select')}
                </Button>
                <Button
                  variant="default"
                  disabled={!docking}
                  onClick={() => {
                    setDocking(null);
                    form.reset();
                  }}>
                  {t('removeSelection')}
                </Button>
              </Group>
              <Collapse in={!!docking}>
                <Paper withBorder shadow="sm">
                  {preview && <DockingPreview data={preview} />}
                </Paper>
              </Collapse>
            </Stack>
          </Fieldset>
        </InputWrapper>
        <Checkbox.Group
          defaultValue={[]}
          {...form.getInputProps('services')}
          key={form.key('services')}>
          <Fieldset
            disabled={!docking}
            legend={
              <Group>
                <IconChecklist size={20} color="var(--mantine-color-blue-5)" />
                <Text>{t('services')}</Text>
              </Group>
            }>
            <Tooltip disabled={!!docking} label={t('servicesTooltip')}>
              <Stack>
                {commonServices.map((service, index) => (
                  <Checkbox
                    value={service.id}
                    label={service.titles[locale]}
                    key={index}
                  />
                ))}
              </Stack>
            </Tooltip>
          </Fieldset>
        </Checkbox.Group>
        <Group grow>
          <Button variant="outline" onClick={close}>
            {t('cancelButtonLabel')}
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={Boolean(Object.keys(form.errors).length)}>
            {t('saveButtonLabel')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
