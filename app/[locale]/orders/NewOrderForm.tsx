'use client';

import { BerthingPreview } from '@/app/components/BerthingPreview';
import { FormButtons } from '@/app/components/FormButtons';
import { useBerthings } from '@/app/context/BerthingContext';
import { useCommonServices } from '@/app/context/CommonServiceContext';
import { useCounterparties } from '@/app/context/CounterpartyContext';
import { useNewOrderFormContext } from '@/app/context/FormContext';
import {
  ActionIcon,
  Button,
  Checkbox,
  Collapse,
  ComboboxItem,
  Fieldset,
  Group,
  InputWrapper,
  Modal,
  Paper,
  Select,
  Space,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAnchor, IconChecklist, IconEdit } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { FormEventHandler, useState } from 'react';

import { EditBerthingForm } from '@/app/components/BerthingForms/EditBerthingForm';
import { NewBerthingForm } from '@/app/components/BerthingForms/NewBerthingForm';
import { SelectBerthingTable } from './SelectBerthingTable';

interface Props {
  onClose(): void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  loading: boolean;
}

export function NewOrderForm({ onClose, onSubmit, loading }: Props) {
  const form = useNewOrderFormContext();
  const t = useTranslations('OrderForm');
  const counterParties = useCounterparties();
  const { berthings } = useBerthings();
  const { commonServices } = useCommonServices();
  const locale = useLocale() as AppTypes.Locale;
  const initialBerthingId = form.getInitialValues()['berthing'];
  const [berthingId, setBerthingId] = useState(initialBerthingId);
  const berthing = berthings.find(({ id }) => id === berthingId);

  const [senderCounterparties, setSenderCounterparties] =
    useState(counterParties);

  const [receiverCounterparties, setReceiverCounterparties] =
    useState(counterParties);

  const senderItems: ComboboxItem[] = senderCounterparties.map(
    (counterparty) => ({
      label: counterparty.dictionary[locale].title,
      value: counterparty.business_id,
    })
  );

  const receiverItems: ComboboxItem[] = receiverCounterparties.map(
    (counterparty) => ({
      label: counterparty.name,
      value: counterparty.business_id,
    })
  );

  form.watch('sender', ({ value }) => {
    setReceiverCounterparties(
      counterParties.filter((receiver) => receiver.business_id !== value)
    );
  });

  form.watch('receiver', ({ value }) => {
    setSenderCounterparties(
      counterParties.filter((sender) => sender.business_id !== value)
    );
  });

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
          close={closeNewBerthing}
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
            resultCallback={closeEditBerthing}
          />
        )}
      </Modal>
      <form onSubmit={onSubmit}>
        <Stack>
          <Group grow align="start">
            <Select
              clearable
              label={t('sender')}
              placeholder={t('select')}
              data={senderItems}
              {...form.getInputProps('sender')}
              key={form.key('sender')}
            />
            <Select
              clearable
              label={t('receiver')}
              placeholder={t('select')}
              data={receiverItems}
              {...form.getInputProps('receiver')}
              key={form.key('receiver')}
            />
          </Group>
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
                <Space h="md" />
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
                      label={service.dictionary[locale].title}
                      key={index}
                    />
                  ))}
                </Stack>
              </Tooltip>
            </Fieldset>
          </Checkbox.Group>
          <Group grow>
            <FormButtons
              closeButtonClickHandler={onClose}
              resetButtonClickHandler={form.reset}
              resetButtonDisabled={form.isDirty()}
              submitButtonDisabled={!form.isDirty() || !form.isValid()}
              submitButtonLoading={loading}
              submitButtonLabel={t('send')}
            />
          </Group>
        </Stack>
      </form>
    </>
  );
}
