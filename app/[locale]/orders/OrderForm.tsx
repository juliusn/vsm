'use client';

import { BerthingPreview } from '@/app/components/BerthingPreview';
import { useBerthings } from '@/app/context/BerthingContext';
import { useCommonServices } from '@/app/context/CommonServiceContext';
import {
  ActionIcon,
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
import { UseFormReturnType } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconAnchor, IconChecklist, IconEdit } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { FormEventHandler, useState } from 'react';
import { EditBerthingForm } from '../port-traffic/EditBerthingForm';
import { NewBerthingForm } from '../port-traffic/NewBerthingForm';
import { OrderFormValues } from './NewOrder';
import { SelectBerthingTable } from './SelectBerthingTable';

export function OrderForm({
  form,
  onEditBerthing,
  onCancel,
  onSubmit,
  loading,
}: {
  form: UseFormReturnType<OrderFormValues>;
  onEditBerthing?(data: AppTypes.Berthing): void;
  onCancel(): void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  loading: boolean;
}) {
  const t = useTranslations('OrderForm');
  const { berthings } = useBerthings();
  const { commonServices } = useCommonServices();
  const locale = useLocale() as AppTypes.Locale;
  const initialBerthingId = form.getInitialValues()['berthing'];
  const [berthingId, setBerthingId] = useState(initialBerthingId);
  const berthing = berthings.find(({ id }) => id === berthingId);

  const berthingRowData = berthing
    ? {
        ...berthing,
        created: new Date(berthing.created_at),
        arrival:
          berthing.port_events.find((event) => event.type === 'arrival') ||
          null,
        departure:
          berthing.port_events.find((event) => event.type === 'departure') ||
          null,
      }
    : null;

  const [
    selectBerthingOpened,
    { open: openSelectBerthing, close: closeSelectBerthing },
  ] = useDisclosure();

  const [
    newBerthingOpened,
    { open: openNewBerthing, close: closeNewBerthing },
  ] = useDisclosure();

  const [
    editBerthingOpened,
    { open: openEditBerthing, close: closeEditBerthing },
  ] = useDisclosure(false);

  return (
    <>
      <Modal
        size="auto"
        opened={selectBerthingOpened}
        onClose={closeSelectBerthing}
        title={t('selectBerthing')}>
        <SelectBerthingTable
          onSelect={(record) => {
            setBerthingId(record.id);
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
          resultCallback={(data) => {
            setBerthingId(data.id);
            form.setFieldValue('berthing', data.id);
            form.setFieldValue('services', []);
            closeNewBerthing();
          }}
        />
      </Modal>
      <Modal
        opened={editBerthingOpened}
        onClose={closeEditBerthing}
        title={t('editBerthing')}>
        {berthingRowData && (
          <EditBerthingForm
            berthingRow={berthingRowData}
            onCancel={closeEditBerthing}
            resultCallback={(data) => {
              onEditBerthing?.(data);
              closeEditBerthing();
            }}
          />
        )}
      </Modal>
      <form onSubmit={onSubmit}>
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
                    disabled={!berthingId}
                    onClick={() => {
                      setBerthingId(initialBerthingId);
                      form.reset();
                    }}>
                    {t('removeSelection')}
                  </Button>
                </Group>
                <Collapse in={!!berthingId}>
                  <Paper
                    withBorder
                    shadow="sm"
                    id="preview"
                    style={{ position: 'relative' }}>
                    {berthingRowData && (
                      <BerthingPreview data={berthingRowData} />
                    )}
                    <ActionIcon
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        zIndex: 1,
                      }}
                      variant="subtle"
                      onClick={openEditBerthing}>
                      <IconEdit stroke={1.5} />
                    </ActionIcon>
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
              disabled={!berthingId}
              legend={
                <Group>
                  <IconChecklist
                    size={20}
                    color="var(--mantine-color-blue-5)"
                  />
                  <Text>{t('services')}</Text>
                </Group>
              }>
              <Tooltip disabled={!!berthingId} label={t('servicesTooltip')}>
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
            <Button variant="outline" onClick={onCancel}>
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
    </>
  );
}
