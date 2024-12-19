'use client';

import {
  Button,
  ComboboxItem,
  Fieldset,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import {
  IconAnchor,
  IconArrowBarRight,
  IconArrowBarToRight,
  IconShip,
} from '@tabler/icons-react';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useRef, useState, useTransition } from 'react';
import { BerthInput } from './BerthInput';
import { ImoInput } from './ImoInput';
import { LocodeInput } from './LocodeInput';
import { PortAreaInput } from './PortAreaInput';
import { VesselNameInput } from './VesselNameInput';
import { useLocationInputs } from './LocationInputContext';

export interface FormValues {
  vessel: string;
  imo: string;
  locode: string;
  portArea: string;
  berth: string;
  etaDate: string;
  etaTime: string;
  etdDate: string;
  etdTime: string;
}

const initialValues: FormValues = {
  vessel: '',
  imo: '',
  locode: '',
  portArea: '',
  berth: '',
  etaDate: '',
  etaTime: '',
  etdDate: '',
  etdTime: '',
};

interface NewDockingContentProps {
  vesselItems: ComboboxItem[];
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
}

export function NewDockingForm({
  vesselItems,
  locations,
  portAreas,
  berths,
}: NewDockingContentProps) {
  const t = useTranslations('NewDockingForm');
  const [updateIsPending] = useTransition();
  const { setLocode, setPortArea, setBerth } = useLocationInputs();
  const [vessel, setVessel] = useState<string | null>(null);

  const isSevenDigits = (value: string) =>
    value.length !== 7 ? t('imoLengthError') : null;

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues,
    validate: {
      imo: (value) =>
        isNotEmpty(t('imoRequiredError'))(value) ?? isSevenDigits(value),
    },
    validateInputOnBlur: true,
  });

  const imoRef = useRef<HTMLInputElement>(null);

  const clear = () => {
    setVessel(null);
    setLocode(null);
    setPortArea(null);
    setBerth(null);
    form.setValues(initialValues);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}>
      <Stack>
        <Fieldset
          legend={
            <Group>
              <IconShip size={20} color="var(--mantine-color-blue-5)" />
              <Text>{t('vessel')}</Text>
            </Group>
          }>
          <VesselNameInput
            {...form.getInputProps('vessel')}
            key={form.key('vessel')}
            vesselItems={vesselItems}
            vessel={vessel}
            setVessel={setVessel}
            form={form}
            imoRef={imoRef}
          />
          <ImoInput form={form} imoRef={imoRef} />
        </Fieldset>
        <Fieldset
          legend={
            <Group>
              <IconAnchor size={20} color="var(--mantine-color-blue-5)" />
              <Text>{t('berth')}</Text>
            </Group>
          }>
          <LocodeInput locations={locations} />
          <PortAreaInput locations={locations} portAreas={portAreas} />
          <BerthInput
            locations={locations}
            portAreas={portAreas}
            berths={berths}
          />
        </Fieldset>
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
          <DateInput
            valueFormat="DD.M.YYYY"
            highlightToday={true}
            label={t('date')}
            placeholder={t('selectDate')}
            clearable
            {...form.getInputProps('etaDate')}
          />
          <TimeInput label={t('time')} {...form.getInputProps('etaTime')} />
        </Fieldset>
        <Fieldset
          legend={
            <Group>
              <IconArrowBarRight size={20} color="var(--mantine-color-red-5)" />
              <Text>{t('departure')}</Text>
            </Group>
          }>
          <DateInput
            valueFormat="DD.M.YYYY"
            highlightToday={true}
            label={t('date')}
            placeholder={t('selectDate')}
            clearable
            {...form.getInputProps('etdDate')}
          />
          <TimeInput label={t('time')} {...form.getInputProps('etdTime')} />
        </Fieldset>
        <Group grow>
          <Button variant="outline" onClick={close}>
            {t('cancelButtonLabel')}
          </Button>
          <Button variant="outline" onClick={clear}>
            {t('clearButtonLabel')}
          </Button>
          <Button
            type="submit"
            disabled={!form.isValid()}
            loading={updateIsPending}>
            {t('saveButtonLabel')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
