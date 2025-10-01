'use client';

import { FormButtons } from '@/app/components/FormButtons';
import { useCommonServices } from '@/app/context/CommonServiceContext';
import { useEditOrderFormContext } from '@/app/context/FormContext';
import { Checkbox, Fieldset, Group, Stack, Text } from '@mantine/core';
import { IconChecklist } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { FormEventHandler } from 'react';
import { BerthingFormFields } from '../../components/BerthingForms/BerthingFormFields';

interface Props {
  vessel: AppTypes.Vessel | undefined;
  imoRef: React.RefObject<HTMLInputElement | null>;
  locode: string;
  portArea: string;
  additionalContent: React.ReactNode;
  status: AppTypes.OrderStatus;
  onClose(): void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  loading: boolean;
}

export function EditOrderForm({
  vessel,
  imoRef,
  locode,
  portArea,
  additionalContent,
  status,
  onClose,
  onSubmit,
  loading,
}: Props) {
  const t = useTranslations('OrderForm');
  const locale = useLocale() as AppTypes.Locale;
  const { commonServices } = useCommonServices();
  const form = useEditOrderFormContext();

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <BerthingFormFields
          useFormContext={useEditOrderFormContext}
          vessel={vessel}
          imoRef={imoRef}
          locode={locode}
          portArea={portArea}
        />
        <Checkbox.Group
          defaultValue={[]}
          {...form.getInputProps('services')}
          key={form.key('services')}>
          <Fieldset
            legend={
              <Group>
                <IconChecklist size={20} color="var(--mantine-color-blue-5)" />
                <Text>{t('services')}</Text>
              </Group>
            }>
            <Stack>
              {commonServices.map((service, index) => (
                <Checkbox
                  value={service.id}
                  label={service.dictionary[locale].title}
                  key={index}
                />
              ))}
            </Stack>
          </Fieldset>
        </Checkbox.Group>
        {additionalContent}
        <Group grow>
          <FormButtons
            closeButtonClickHandler={onClose}
            resetButtonClickHandler={form.reset}
            resetButtonDisabled={!form.isDirty()}
            submitButtonDisabled={
              (status !== 'cancelled' && !form.isDirty()) || !form.isValid()
            }
            submitButtonLoading={loading}
            submitButtonLabel={status === 'cancelled' ? t('send') : undefined}
          />
        </Group>
      </Stack>
    </form>
  );
}
