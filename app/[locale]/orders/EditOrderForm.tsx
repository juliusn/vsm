'use client';

import { useCommonServices } from '@/app/context/CommonServiceContext';
import { Button, Checkbox, Fieldset, Group, Stack, Text } from '@mantine/core';
import { GetInputPropsReturnType } from '@mantine/form/lib/types';
import { IconChecklist } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { ComponentProps, FormEventHandler } from 'react';
import { BerthingFormFields } from '../../components/BerthingFormFields';
import { LocationInputs } from '../port-traffic/LocationInputs';
import { VesselInputs } from '../port-traffic/VesselInputs';

interface Props {
  vesselInputsProps: ComponentProps<typeof VesselInputs>;
  locationInputsProps: ComponentProps<typeof LocationInputs>;
  etaDateProps: GetInputPropsReturnType;
  etaDateKey: string;
  etaTimeProps: GetInputPropsReturnType;
  etaTimeKey: string;
  etdDateProps: GetInputPropsReturnType;
  etdDateKey: string;
  etdTimeProps: GetInputPropsReturnType;
  etdTimeKey: string;
  servicesProps: GetInputPropsReturnType;
  servicesKey: string;
  onCancel(): void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  loading: boolean;
  submitDisabled: boolean;
}

export function EditOrderForm({
  vesselInputsProps,
  locationInputsProps,
  etaDateProps,
  etaDateKey,
  etaTimeProps,
  etaTimeKey,
  etdDateProps,
  etdDateKey,
  etdTimeProps,
  etdTimeKey,
  servicesProps,
  servicesKey,
  onCancel,
  onSubmit,
  loading,
  submitDisabled,
}: Props) {
  const t = useTranslations('OrderForm');
  const locale = useLocale() as AppTypes.Locale;
  const { commonServices } = useCommonServices();

  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <BerthingFormFields
          vesselInputsProps={vesselInputsProps}
          locationInputsProps={locationInputsProps}
          etaDateProps={etaDateProps}
          etaDateKey={etaDateKey}
          etaTimeProps={etaTimeProps}
          etaTimeKey={etaTimeKey}
          etdDateProps={etdDateProps}
          etdDateKey={etdDateKey}
          etdTimeProps={etdTimeProps}
          etdTimeKey={etdTimeKey}
        />
        <Checkbox.Group defaultValue={[]} {...servicesProps} key={servicesKey}>
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
                  label={service.titles[locale]}
                  key={index}
                />
              ))}
            </Stack>
          </Fieldset>
        </Checkbox.Group>
        <Group grow>
          <Button variant="outline" onClick={onCancel}>
            {t('cancelButtonLabel')}
          </Button>
          <Button type="submit" loading={loading} disabled={submitDisabled}>
            {t('saveButtonLabel')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
