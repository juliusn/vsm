'use client';

import { useErrorNotification } from '@/app/hooks/useErrorNotification';
import { createClient } from '@/lib/supabase/client';
import {
  Button,
  Collapse,
  ComboboxData,
  ComboboxItem,
  Group,
  Input,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { ActionTypes, useLocation } from '../LocationContext';
import { isNotEmpty, useForm } from '@mantine/form';

interface FormValues {
  titleEn: string;
  titleFi: string;
}

export function NewBerthServiceForm({
  locode,
  portAreaCode,
  berthCode,
  close,
}: {
  locode: string;
  portAreaCode: string;
  berthCode: string;
  close: () => void;
}) {
  const supabase = createClient();
  const locale = useLocale() as AppTypes.Locale;
  const {
    state: { location, portAreas, berths, berthServices },
    dispatch,
  } = useLocation();
  const portArea = portAreas.find(
    (portArea) =>
      portArea.locode === locode && portArea.port_area_code === portAreaCode
  );
  const berth = berths.find(
    (berth) =>
      berth.locode === locode &&
      berth.port_area_code === portAreaCode &&
      berth.berth_code === berthCode
  );
  const localTitles = berthServices
    .filter(
      (berthService) =>
        berthService.locode === locode &&
        berthService.port_area_code === portAreaCode &&
        berthService.berth_code === berthCode
    )
    .map((service) => JSON.stringify(service.titles));

  const getErrorNotification = useErrorNotification();
  const t = useTranslations('NewBerthServiceForm');
  const titleLabels: Record<AppTypes.Locale, string> = {
    en: t('titleInputLabelEn'),
    fi: t('titleInputLabelFi'),
  };
  const [opened, { toggle }] = useDisclosure(false);
  const [serviceOptions, setServiceOptions] = useState<ComboboxData>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [insertIsPending, startInsert] = useTransition();
  const titleNotAdded = (locale: AppTypes.Locale) => (value: string) =>
    localTitles.some(
      (titles) =>
        (JSON.parse(titles) as AppTypes.ServiceTitles)[locale] === value
    )
      ? t('titleAddedError', { berthCode })
      : null;

  const form = useForm<FormValues>({
    initialValues: {
      titleEn: '',
      titleFi: '',
    },
    validate: {
      titleEn: (value) =>
        isNotEmpty(t('fieldRequiredError'))(value) ??
        titleNotAdded('en')(value),
      titleFi: (value) =>
        isNotEmpty(t('fieldRequiredError'))(value) ??
        titleNotAdded('fi')(value),
    },
    validateInputOnBlur: true,
  });

  const handleSubmit: React.FormEventHandler = (event) => {
    event.preventDefault();

    startInsert(async () => {
      const { titleEn, titleFi } = form.values;

      const { data, error, status } = await supabase
        .from('berth_services')
        .insert({
          locode,
          port_area_code: portAreaCode,
          berth_code: berthCode,
          enabled: true,
          titles: { en: titleEn, fi: titleFi },
        })
        .select()
        .single();

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      dispatch({
        type: ActionTypes.INSERT_SERVICE,
        payload: {
          service: { ...data, titles: data.titles as AppTypes.ServiceTitles },
        },
      });

      showNotification({
        title: t('successTitle'),
        message: t('successMessage'),
        icon: <IconCheck stroke={1.5} />,
        color: 'green',
      });

      close();
    });
  };

  useEffect(() => {
    const fetchServiceOptions = async () => {
      const { data, error, status } = await supabase
        .from('common_services')
        .select();

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      const options = data.map(
        (service): ComboboxItem => ({
          label: (service.titles as AppTypes.ServiceTitles)[locale],
          value: JSON.stringify(service.titles),
          disabled: localTitles.includes(JSON.stringify(service.titles)),
        })
      );

      setServiceOptions(options);
    };

    fetchServiceOptions();
  }, [supabase, getErrorNotification, locale, localTitles]);

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Input.Wrapper label={t('berth')}>
          <Group grow>
            <Button
              variant="default"
              justify="start"
              onClick={toggle}
              leftSection={opened ? <IconChevronUp /> : <IconChevronDown />}>
              <Text>{berthCode}</Text>
            </Button>
          </Group>
          <Collapse in={opened}>
            <Text>{berth ? berth.berth_name : berthCode}</Text>
            <Text>{portArea ? portArea.port_area_name : portAreaCode}</Text>
            <Text>{location.location_name}</Text>
          </Collapse>
        </Input.Wrapper>
        <Select
          clearable
          description={t('selectDescription')}
          placeholder={t('selectPlaceholder')}
          data={serviceOptions}
          value={selectedService}
          onChange={(value) => {
            setSelectedService(value);
            if (value === null) {
              form.setFieldValue('titleEn', '');
              form.setFieldValue('titleFi', '');
              return;
            }
            const { en, fi } = JSON.parse(value) as AppTypes.ServiceTitles;
            form.setFieldValue('titleEn', en);
            form.setFieldValue('titleFi', fi);
          }}
        />
        <TextInput
          required
          label={titleLabels['en']}
          {...form.getInputProps('titleEn')}
        />
        <TextInput
          required
          label={titleLabels['fi']}
          {...form.getInputProps('titleFi')}
        />
        <Group grow>
          <Button variant="outline" onClick={close}>
            {t('cancelButtonLabel')}
          </Button>
          <Button
            type="submit"
            disabled={!form.isValid()}
            loading={insertIsPending}>
            {t('saveButtonLabel')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
