'use client';

import { EditBerthingForm } from '@/app/components/BerthingForms/EditBerthingForm';
import { NewBerthingForm } from '@/app/components/BerthingForms/NewBerthingForm';
import { BerthingPreview } from '@/app/components/BerthingPreview';
import { FormButtons } from '@/app/components/FormButtons';
import { useBerthings } from '@/app/context/BerthingContext';
import { BerthingInputDataProvider } from '@/app/context/BerthingInputDataContext';
import { useCommonServices } from '@/app/context/CommonServiceContext';
import { useCounterparties } from '@/app/context/CounterpartyContext';
import { useOrderFormContext } from '@/app/context/OrderFormContext';
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
import { SelectBerthingTable } from './SelectBerthingTable/SelectBerthingTable';

interface Props {
  onClose(): void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  loading: boolean;
  submitButtonLabel: string;
}

export function OrderForm({
  onClose,
  onSubmit,
  loading,
  submitButtonLabel,
}: Props) {
  const form = useOrderFormContext();
  const t = useTranslations('OrderForm');
  const counterParties = useCounterparties();
  const { berthings } = useBerthings();
  const { commonServices } = useCommonServices();
  const locale = useLocale();
  const initialBerthingId = form.getInitialValues().berthing;
  const servicesProps = form.getInputProps('services');

  const [selectedBerthingId, setSelectedBerthingId] =
    useState(initialBerthingId);

  const selectedBerthing =
    berthings.find(({ id }) => id === selectedBerthingId) || null;

  const [senderCounterparties, setSenderCounterparties] = useState(
    counterParties.filter(
      (counterparty) =>
        counterparty.business_id !==
        form.getInitialValues().receiver_counterparty_business_id
    )
  );

  const [receiverCounterparties, setReceiverCounterparties] = useState(
    counterParties.filter(
      (counterparty) =>
        counterparty.business_id !==
        form.getInitialValues().sender_counterparty_business_id
    )
  );

  const senderItems: ComboboxItem[] = senderCounterparties.map(
    (counterparty) => ({
      label: counterparty.dictionary[locale].title,
      value: counterparty.business_id,
    })
  );

  const receiverItems: ComboboxItem[] = receiverCounterparties.map(
    (counterparty) => ({
      label: counterparty.dictionary[locale].title,
      value: counterparty.business_id,
    })
  );

  form.watch('sender_counterparty_business_id', ({ value }) => {
    setReceiverCounterparties(
      counterParties.filter(
        (counterparty) => counterparty.business_id !== value
      )
    );
  });

  form.watch('receiver_counterparty_business_id', ({ value }) => {
    setSenderCounterparties(
      counterParties.filter(
        (counterparty) => counterparty.business_id !== value
      )
    );
  });

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
    <form onSubmit={onSubmit}>
      <Modal
        size="70rem"
        opened={selectBerthingOpened}
        onClose={closeSelectBerthing}
        title={t('selectBerthing')}>
        <SelectBerthingTable
          initial={initialBerthingId}
          selected={selectedBerthingId}
          onSelect={(record) => {
            setSelectedBerthingId(record.id);
            form.setFieldValue('berthing', record.id);
            closeSelectBerthing();
          }}
        />
      </Modal>

      <Modal
        opened={newBerthingOpened}
        onClose={closeNewBerthing}
        title={t('createNewBerthing')}>
        <BerthingInputDataProvider>
          <NewBerthingForm
            close={closeNewBerthing}
            resultCallback={(newBerthingId) => {
              setSelectedBerthingId(newBerthingId);
              form.setFieldValue('berthing', newBerthingId);
              /* form.setFieldValue('services', []); */
              closeNewBerthing();
            }}
          />
        </BerthingInputDataProvider>
      </Modal>

      <Modal
        opened={editBerthingOpened}
        onClose={closeEditBerthing}
        title={t('editBerthing')}>
        {selectedBerthing && (
          <BerthingInputDataProvider selectedBerthing={selectedBerthing}>
            <EditBerthingForm
              initialBerthing={selectedBerthing}
              onCancel={closeEditBerthing}
              resultCallback={closeEditBerthing}
            />
          </BerthingInputDataProvider>
        )}
      </Modal>

      <Stack>
        <Group grow align="start">
          <Select
            clearable
            label={t('sender')}
            placeholder={t('select')}
            data={senderItems}
            {...form.getInputProps('sender_counterparty_business_id')}
            key={form.key('sender')}
          />
          <Select
            clearable
            label={t('receiver')}
            placeholder={t('select')}
            data={receiverItems}
            {...form.getInputProps('receiver_counterparty_business_id')}
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
                disabled={!selectedBerthingId}
                onClick={() => {
                  setSelectedBerthingId(null);
                  form.setFieldValue('berthing', null);
                }}>
                {t('removeSelection')}
              </Button>
            </Group>
            <Collapse in={!!selectedBerthingId}>
              <Space h="md" />
              <Paper
                withBorder
                shadow="sm"
                id="preview"
                style={{ position: 'relative' }}>
                {selectedBerthing && (
                  <BerthingPreview berthing={selectedBerthing} />
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
          disabled={!selectedBerthingId}
          {...form.getInputProps('services')}
          key={form.key('services')}
          onChange={(value) => servicesProps.onChange([...value].sort())}>
          <Fieldset
            legend={
              <Group>
                <IconChecklist size={20} color="var(--mantine-color-blue-5)" />
                <Text>{t('services')}</Text>
              </Group>
            }>
            <Tooltip
              disabled={!!selectedBerthingId}
              label={t('servicesTooltip')}>
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
            resetButtonClickHandler={() => {
              form.reset();
              setSelectedBerthingId(initialBerthingId);
            }}
            resetButtonDisabled={!form.isDirty()}
            submitButtonDisabled={!form.isDirty() || !form.isValid()}
            submitButtonLoading={loading}
            submitButtonLabel={submitButtonLabel}
          />
        </Group>
      </Stack>
    </form>
  );
}
