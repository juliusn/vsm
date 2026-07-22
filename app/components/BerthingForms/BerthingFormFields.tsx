'use client';

import { VesselInputs } from '@/app/components/BerthingForms/VesselInputs';
import { useBerthingFormContext } from '@/app/context/BerthingFormContext';
import { Button, Fieldset, Group, Space, Stack, Text } from '@mantine/core';
import {
  IconArrowBarRight,
  IconArrowBarToRight,
  IconArrowsHorizontal,
  IconPlus,
  IconShip,
} from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { Fragment } from 'react';
import PortEventFields from './PortEventFields';
import { createEmptyPortEvent } from '../../../lib/portEventForm';

export function BerthingFormFields() {
  const t = useTranslations('BerthingFormFields');
  const form = useBerthingFormContext();

  return (
    <>
      <Fieldset
        legend={
          <Group>
            <IconShip size={20} color="var(--mantine-color-blue-5)" />
            <Text>{t('vessel')}</Text>
          </Group>
        }>
        <Stack>
          <VesselInputs />
        </Stack>
      </Fieldset>
      <Space h="lg" />
      {form.getValues().arrival ? (
        <Fieldset
          legend={
            <Group>
              <IconArrowBarToRight
                size={20}
                color="var(--mantine-color-green-5)"
              />
              <Text>{t('arrival')}</Text>
            </Group>
          }>
          <PortEventFields
            path="arrival"
            removeClickHandler={() => form.setFieldValue('arrival', null)}
            removeButtonLabel={t('removeArrival')}
          />
        </Fieldset>
      ) : (
        <Button
          onClick={() => form.setFieldValue('arrival', createEmptyPortEvent())}
          leftSection={<IconPlus size={18} stroke={1.5} />}
          variant="transparent">
          {t('addArrival')}
        </Button>
      )}

      <Space h="lg" />

      {form.getValues().shiftings.map((shifting, index) => (
        <Fragment key={shifting.formKey}>
          {index > 0 && <Space h="lg" />}
          <Fieldset
            legend={
              <Group>
                <IconArrowsHorizontal
                  size={20}
                  color="var(--mantine-color-blue-5)"
                />
                <Text>
                  {t('shifting')} {index + 1}
                </Text>
              </Group>
            }>
            <PortEventFields
              path={`shiftings.${index}`}
              removeClickHandler={() => form.removeListItem('shiftings', index)}
              removeButtonLabel={t('removeShifting')}
            />
          </Fieldset>
        </Fragment>
      ))}

      <Button
        onClick={() => {
          form.insertListItem('shiftings', createEmptyPortEvent());
        }}
        leftSection={<IconPlus size={18} stroke={1.5} />}
        variant="transparent">
        {t('addShifting')}
      </Button>

      <Space h="lg" />

      {form.getValues().departure ? (
        <Fieldset
          legend={
            <Group>
              <IconArrowBarRight size={20} color="var(--mantine-color-red-5)" />
              <Text>{t('departure')}</Text>
            </Group>
          }>
          <PortEventFields
            path="departure"
            removeClickHandler={() => form.setFieldValue('departure', null)}
            removeButtonLabel={t('removeDeparture')}
          />
        </Fieldset>
      ) : (
        <Button
          onClick={() =>
            form.setFieldValue('departure', createEmptyPortEvent())
          }
          leftSection={<IconPlus size={18} stroke={1.5} />}
          variant="transparent">
          {t('addDeparture')}
        </Button>
      )}
    </>
  );
}
