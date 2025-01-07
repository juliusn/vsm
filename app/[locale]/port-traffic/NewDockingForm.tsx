'use client';

import {
  useDockingSavedNotification,
  useErrorNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import {
  Button,
  Collapse,
  ComboboxItem,
  ComboboxItemGroup,
  Fieldset,
  Group,
  Stack,
  Text,
} from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import {
  IconAnchor,
  IconArrowBarRight,
  IconArrowBarToRight,
  IconShip,
} from '@tabler/icons-react';
import dayjs from 'dayjs';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useTransition } from 'react';
import { VesselDetails } from '../orders/VesselDetails';
import { BerthInput } from './BerthInput';
import { ImoInput } from './ImoInput';
import { LocodeInput } from './LocodeInput';
import { PortAreaInput } from './PortAreaInput';
import { VesselNameInput } from './VesselNameInput';
import { FormValidateInput } from '@mantine/form/lib/types';

export interface FormValues {
  vesselName: string;
  imo: number | '';
  locode: string;
  portArea: string;
  berth: string;
  etaDate: Date | '';
  etaTime: string;
  etdDate: Date | '';
  etdTime: string;
}

const initialValues: FormValues = {
  vesselName: '',
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
  vessels: AppTypes.Vessel[];
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
  close: () => void;
}

export type PortAreaIdentifier = {
  locode: string;
  port_area_code: string;
};

type BerthIdentifier = {
  locode: string;
  port_area_code: string;
  berth_code: string;
};

const isSevenDigits = (errorMessage: string) => (value: number | '') =>
  value.toString().length !== 7 ? errorMessage : null;

export function NewDockingForm({
  vessels,
  locations,
  portAreas,
  berths,
  close,
}: NewDockingContentProps) {
  const t = useTranslations('NewDockingForm');
  const [updateIsPending] = useTransition();
  const [mostRecentVessel, setMostRecentVessel] = useState<
    AppTypes.Vessel | undefined
  >(undefined);
  const supabase = createClient();
  const getErrorNotification = useErrorNotification();
  const getDockingSavedNotification = useDockingSavedNotification();
  const validate = useValidate();

  const form = useForm<FormValues>({
    mode: 'uncontrolled',
    initialValues,
    validate,
    validateInputOnBlur: true,
    transformValues: (values) => ({
      ...values,
      portArea:
        values.portArea &&
        (JSON.parse(values.portArea) as PortAreaIdentifier).port_area_code,
      berth:
        values.berth &&
        (JSON.parse(values.berth) as BerthIdentifier).berth_code,
    }),
  });

  const { locode, portArea } = form.getValues();
  const [vessel, setVessel] = useState<AppTypes.Vessel | undefined>();
  const { portAreaData, berthsData } = getInputData(locode, portArea);
  const imoRef = useRef<HTMLInputElement>(null);
  const vesselItems = vessels.map(
    (vessel): ComboboxItem => ({
      value: vessel.imo.toString(),
      label: vessel.name,
    })
  );

  form.watch('vesselName', ({ value }) => {
    if (value) {
      form.setFieldValue('imo', Number(value));
      setTimeout(() => {
        imoRef.current?.select();
      }, 0);
    } else {
      form.setFieldValue('imo', '');
      form.getInputNode('vesselName')?.focus();
    }
  });

  form.watch('imo', ({ value }) => {
    const match = vessels.find((vessel) => vessel.imo === value);
    setVessel(match);
  });

  form.watch('locode', ({ value }) => {
    if (!value) {
      form.setFieldValue('portArea', '');
      form.setFieldValue('berth', '');
    }
  });

  form.watch('portArea', ({ value }) => {
    if (value) {
      const { locode }: PortAreaIdentifier = JSON.parse(value);
      form.setFieldValue('locode', locode);
    } else {
      form.setFieldValue('portArea', '');
      form.setFieldValue('berth', '');
    }
  });

  form.watch('berth', ({ value }) => {
    if (value) {
      const { locode, port_area_code }: BerthIdentifier = JSON.parse(value);
      form.setFieldValue('locode', locode);
      const portArea: PortAreaIdentifier = { locode, port_area_code };
      form.setFieldValue('portArea', JSON.stringify(portArea));
    } else {
      form.setFieldValue('berth', '');
    }
  });

  const handleSubmit = async ({
    imo,
    vesselName,
    locode,
    portArea,
    berth,
    etaDate,
    etaTime,
    etdDate,
    etdTime,
  }: FormValues) => {
    if (imo === '') {
      return;
    }

    const dockingsResponse = await supabase
      .from('dockings')
      .insert({
        vessel_imo: imo,
        vessel_name: vesselName || null,
        locode: locode || null,
        port_area_code: portArea || null,
        berth_code: berth || null,
      })
      .select()
      .single();

    if (dockingsResponse.error) {
      showNotification(getErrorNotification(dockingsResponse.status));
      return;
    }

    const dockingEventsQueries = [];

    if (etaDate) {
      dockingEventsQueries.push(
        supabase.from('docking_events').insert({
          docking: dockingsResponse.data.id,
          type: 'arrival',
          estimated_date: etaDate.toISOString(),
          estimated_time: etaTime || null,
        })
      );
    }

    if (etdDate) {
      dockingEventsQueries.push(
        supabase.from('docking_events').insert({
          docking: dockingsResponse.data.id,
          type: 'departure',
          estimated_date: etdDate.toISOString(),
          estimated_time: etdTime || null,
        })
      );
    }

    const dockingEventsResponses = await Promise.all(dockingEventsQueries);
    const errorResponse = dockingEventsResponses.find(
      (response) => response.error
    );

    if (errorResponse) {
      showNotification(getErrorNotification(errorResponse.status));
      return;
    }

    showNotification(getDockingSavedNotification());
    close();
  };

  useEffect(() => {
    if (vessel) {
      setMostRecentVessel(vessel);
    }
  }, [vessel]);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <Fieldset
          legend={
            <Group>
              <IconShip size={20} color="var(--mantine-color-blue-5)" />
              <Text>{t('vessel')}</Text>
            </Group>
          }>
          <Stack>
            <VesselNameInput
              data={vesselItems}
              key={form.key('vesselName')}
              {...form.getInputProps('vesselName')}
            />
            <ImoInput key={form.key('imo')} {...form.getInputProps('imo')} />
            <Collapse in={!!vessel}>
              {mostRecentVessel && <VesselDetails vessel={mostRecentVessel} />}
            </Collapse>
          </Stack>
        </Fieldset>
        <Fieldset
          legend={
            <Group>
              <IconAnchor size={20} color="var(--mantine-color-blue-5)" />
              <Text>{t('berth')}</Text>
            </Group>
          }>
          <Stack>
            <LocodeInput
              locations={locations}
              key={form.key('locode')}
              {...form.getInputProps('locode')}
            />
            <PortAreaInput
              data={portAreaData}
              key={form.key('portArea')}
              {...form.getInputProps('portArea')}
            />
            <BerthInput
              data={berthsData}
              key={form.key('berth')}
              {...form.getInputProps('berth')}
            />
          </Stack>
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
          <Stack>
            <DateInput
              valueFormat="DD.M.YYYY"
              highlightToday={true}
              label={t('date')}
              placeholder={t('selectDate')}
              clearable
              key={form.key('etaDate')}
              {...form.getInputProps('etaDate')}
            />
            <TimeInput
              label={t('time')}
              key={form.key('etaTime')}
              {...form.getInputProps('etaTime')}
            />
          </Stack>
        </Fieldset>
        <Fieldset
          legend={
            <Group>
              <IconArrowBarRight size={20} color="var(--mantine-color-red-5)" />
              <Text>{t('departure')}</Text>
            </Group>
          }>
          <Stack>
            <DateInput
              valueFormat="DD.M.YYYY"
              highlightToday={true}
              label={t('date')}
              placeholder={t('selectDate')}
              clearable
              key={form.key('etdDate')}
              {...form.getInputProps('etdDate')}
            />
            <TimeInput
              label={t('time')}
              key={form.key('etdTime')}
              {...form.getInputProps('etdTime')}
            />
          </Stack>
        </Fieldset>
        <Group grow>
          <Button variant="outline" onClick={close}>
            {t('cancelButtonLabel')}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              form.reset();
              setVessel(undefined);
            }}>
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

  function getInputData(locode: string, portArea: string) {
    const filteredPortAreas = portAreas.filter((portArea) =>
      locode ? portArea.locode === locode : true
    );

    const portAreaData = locations.map(
      ({ location_name }): ComboboxItemGroup => ({
        group: location_name,
        items: filteredPortAreas.map(
          ({ locode, port_area_code, port_area_name }): ComboboxItem => ({
            value: JSON.stringify({ locode, port_area_code }),
            label: `${port_area_code} - ${port_area_name}`,
          })
        ),
      })
    );

    const portAreaId = portArea
      ? (JSON.parse(portArea) as PortAreaIdentifier)
      : null;

    const filteredPortAreaLocationNames = filteredPortAreas.map(
      ({ locode }) =>
        locations.find((location) => location.locode === locode)?.location_name
    );

    const filteredBerths = berths.filter(
      (berth) =>
        (locode ? berth.locode === locode : true) &&
        (portAreaId
          ? portAreaId.locode === berth.locode &&
            portAreaId.port_area_code === berth.port_area_code
          : true)
    );

    const berthsData = filteredPortAreas.map(
      ({ port_area_code, port_area_name }, index): ComboboxItemGroup => ({
        group: `${filteredPortAreaLocationNames[index]} ${port_area_name}`,
        items: filteredBerths
          .filter((berth) => berth.port_area_code === port_area_code)
          .map(
            ({
              locode,
              port_area_code,
              berth_code,
              berth_name,
            }): ComboboxItem => ({
              value: JSON.stringify({ locode, port_area_code, berth_code }),
              label:
                berth_code === berth_name
                  ? berth_code
                  : `${berth_code} - ${berth_name}`,
            })
          ),
      })
    );

    return { portAreaData, berthsData };
  }
}

function useValidate(): FormValidateInput<FormValues> {
  const t = useTranslations('NewDockingForm');
  return {
    imo: (value: number | '') =>
      isNotEmpty(t('imoRequiredError'))(value) ??
      isSevenDigits(t('imoLengthError'))(value),
    etaDate: (value: Date | '', values: FormValues) => {
      if (values.etaTime && !value) {
        return t('timeWithoutDateError');
      }
      if (
        value &&
        values.etdDate &&
        dayjs(value).isAfter(dayjs(values.etdDate))
      ) {
        return t('etaAfterEtdError');
      }
      return null;
    },
    etaTime: (value, values) => {
      if (value && !values.etaDate) {
        return t('timeWithoutDateError');
      }
      const etdDateTime = dayjs(
        `${dayjs(values.etdDate).format('YYYY-MM-DD')}T${values.etdTime}`,
        'YYYY-MM-DDTHH:mm',
        true
      );
      const etaDateTime = dayjs(
        `${dayjs(values.etaDate).format('YYYY-MM-DD')}T${value}`,
        'YYYY-MM-DDTHH:mm',
        true
      );
      if (
        value &&
        values.etdDate &&
        values.etdTime &&
        etdDateTime.isBefore(etaDateTime)
      ) {
        return t('etaAfterEtdError');
      }
      return null;
    },
    etdDate: (value, values) => {
      if (values.etdTime && !value) {
        return t('timeWithoutDateError');
      }
      if (
        value &&
        values.etaDate &&
        dayjs(value).isBefore(dayjs(values.etaDate))
      ) {
        return t('etdBeforeEtaError');
      }
      return null;
    },
    etdTime: (value, values) => {
      if (value && !values.etdDate) {
        return t('timeWithoutDateError');
      }
      const etdDateTime = dayjs(
        `${dayjs(values.etdDate).format('YYYY-MM-DD')}T${value}`,
        'YYYY-MM-DDTHH:mm',
        true
      );
      const etaDateTime = dayjs(
        `${dayjs(values.etaDate).format('YYYY-MM-DD')}T${values.etaTime}`,
        'YYYY-MM-DDTHH:mm',
        true
      );
      if (
        value &&
        values.etaDate &&
        values.etaTime &&
        etdDateTime.isBefore(etaDateTime)
      ) {
        return t('etdBeforeEtaError');
      }
      return null;
    },
  };
}
