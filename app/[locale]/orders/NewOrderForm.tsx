'use client';

import { BerthingPreview } from '@/app/components/BerthingPreview';
import { useCommonServices } from '@/app/context/CommonServiceContext';
import {
  useOrderSavedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { BerthingRowData } from '@/lib/types/berthing';
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
import { NewBerthingForm } from '../port-traffic/NewBerthingForm';
import { SelectBerthingTable } from './SelectBerthingTable';

type NewOrderValues = {
  berthing: string;
  services: string[];
};

export function NewOrderForm({ close }: { close(): void }) {
  const t = useTranslations('NewOrderForm');
  const locale = useLocale() as AppTypes.Locale;
  const supabase = createClient();
  const [berthing, setBerthing] = useState<BerthingRowData | null>(null);
  const [preview, setPreview] = useState<BerthingRowData | null>(null);
  const [loading, setLoading] = useState(false);
  const { commonServices } = useCommonServices();
  const getErrorNotification = usePostgresErrorNotification();
  const getOrderSavedNotification = useOrderSavedNotification();

  const [
    selectBerthingOpened,
    { open: openSelectBerthing, close: closeSelectBerthing },
  ] = useDisclosure();

  const [
    newBerthingOpened,
    { open: openNewBerthing, close: closeNewBerthing },
  ] = useDisclosure();

  const form = useForm<NewOrderValues>({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: { berthing: '', services: [] },
    validate: {
      berthing: (berthing) => (berthing ? null : t('selectBerthingError')),
      services: (services) =>
        services.length ? null : t('selectServicesError'),
    },
  });

  const handleSubmit = async ({ berthing, services }: NewOrderValues) => {
    setLoading(true);

    const { data, error, status } = await supabase
      .from('orders')
      .insert({ berthing })
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
        opened={selectBerthingOpened}
        onClose={closeSelectBerthing}
        title={t('selectBerthing')}>
        <SelectBerthingTable
          onRowClick={({ record }) => {
            setBerthing(record);
            setPreview(record);
            form.setFieldValue('berthing', record.id);
            form.setFieldValue('services', []);
            closeSelectBerthing();
          }}
        />
      </Modal>
      <Modal
        opened={newBerthingOpened}
        onClose={closeNewBerthing}
        title={t('createNewBerthing')}>
        <NewBerthingForm
          close={closeNewBerthing}
          resultCallback={(data) => {
            setBerthing(data);
            setPreview(data);
            form.setFieldValue('services', []);
          }}
        />
      </Modal>
      <Stack>
        <InputWrapper
          required
          {...form.getInputProps('berthing')}
          key={form.key('berthing')}>
          <Fieldset
            legend={
              <Group>
                <IconAnchor size={20} color="var(--mantine-color-blue-5)" />
                <Text>{t('berthing')}</Text>
              </Group>
            }>
            <Stack>
              <Group grow>
                <Button
                  variant="outline"
                  onClick={() => {
                    openNewBerthing();
                  }}>
                  {t('create')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    openSelectBerthing();
                  }}>
                  {t('select')}
                </Button>
                <Button
                  variant="default"
                  disabled={!berthing}
                  onClick={() => {
                    setBerthing(null);
                    form.reset();
                  }}>
                  {t('removeSelection')}
                </Button>
              </Group>
              <Collapse in={!!berthing}>
                <Paper withBorder shadow="sm">
                  {preview && <BerthingPreview data={preview} />}
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
            disabled={!berthing}
            legend={
              <Group>
                <IconChecklist size={20} color="var(--mantine-color-blue-5)" />
                <Text>{t('services')}</Text>
              </Group>
            }>
            <Tooltip disabled={!!berthing} label={t('servicesTooltip')}>
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
