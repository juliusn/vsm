'use client';

import {
  ComboboxItem,
  ComboboxItemGroup,
  MultiSelect,
  Select,
  Stack,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Berth, PortArea } from './page';

const shipItems: ComboboxItem[] = [
  { value: '230705000', label: 'VIKING XPRS' },
  { value: '230713000', label: 'VIKING CINDERELLA' },
  { value: '230361000', label: 'GABRIELLA' },
  { value: '276807000', label: 'SILJA EUROPA' },
  { value: '276829000', label: 'MEGASTAR' },
  { value: '276859000', label: 'MYSTAR' },
  { value: '265004000', label: 'SILJA SYMPHONY' },
  { value: '230184000', label: 'SILJA SERENADE' },
].sort((a, b) => a.label.localeCompare(b.label));

const taskItems: ComboboxItemGroup<ComboboxItem>[] = [
  {
    group: 'XPRS',
    items: [
      { value: 'Bow lines mooring', label: 'Bow lines mooring' },
      { value: 'Stern lines mooring', label: 'Stern lines mooring' },
      {
        value: 'Upper gangway deployment',
        label: 'Upper gangway deployment',
      },
      {
        value: 'Lower gangway deployment',
        label: 'Lower gangway deployment',
      },
      {
        value: 'Disembarkation supervision',
        label: 'Disembarkation supervision',
      },
      { value: 'Embarkation supervision', label: 'Embarkation supervision' },
      {
        value: 'Upper gangway retraction',
        label: 'Upper gangway retraction',
      },
      {
        value: 'Lower gangway retraction',
        label: 'Lower gangway retraction',
      },
      { value: 'Bow lines unmooring', label: 'Bow lines unmooring' },
      { value: 'Stern lines unmooring', label: 'Stern lines unmooring' },
    ],
  },
];

export function NewOrderForm({
  portAreas,
  berths,
}: {
  portAreas: PortArea[];
  berths: Berth[];
}) {
  const t = useTranslations('Orders');
  portAreas.sort((a, b) =>
    a.properties.portAreaName.localeCompare(b.properties.portAreaName)
  );
  berths.sort((a, b) => a.berthCode.localeCompare(b.berthCode));
  const portAreaItems = portAreas.map((portArea) => ({
    label: portArea.properties.portAreaName,
    value: portArea.portAreaCode,
  }));
  const [berthItems, setBerthItems] = useState<string[]>([]);
  const [berthCode, setBerthCode] = useState<string | null>(null);
  const allTaskItems = taskItems.flatMap((group) => group.items);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const handleOptionsChange = (values: string[]) => {
    const orderedValues = values.sort(
      (a, b) =>
        allTaskItems.findIndex((item) => item.value === a) -
        allTaskItems.findIndex((item) => item.value === b)
    );
    setSelectedTasks(orderedValues);
  };
  const handlePortAreaChange = (portAreaCode: string | null) => {
    const availableBerths = berths.filter(
      (berth) => berth.portAreaCode === portAreaCode
    );
    setBerthItems(
      availableBerths
        .map((berth) => berth.berthCode)
        .filter((berthCode, index, array) => array.indexOf(berthCode) === index)
    );
    if (!availableBerths.find((berth) => berth.berthCode === berthCode)) {
      setBerthCode(null);
    }
  };
  const handleBerthChange = (value: string | null) => {
    setBerthCode(value);
  };

  return (
    <form>
      <Stack>
        <Select
          data={portAreaItems}
          label={t('portArea')}
          placeholder={t('selectPortArea')}
          searchable
          clearable
          onChange={handlePortAreaChange}
        />
        <Select
          data={berthItems}
          value={berthCode}
          disabled={!berthItems.length}
          label={t('berth')}
          placeholder={t('selectBerth')}
          searchable
          clearable
          onChange={handleBerthChange}
        />
        <Select
          data={shipItems}
          label={t('vessel')}
          placeholder={t('selectVessel')}
          searchable
          clearable
        />
        <MultiSelect
          data={taskItems}
          label={t('tasks')}
          placeholder={t('addTask')}
          searchable
          clearable
          value={selectedTasks}
          onChange={handleOptionsChange}
        />
        <DateTimePicker
          valueFormat="DD.M.YYYY HH:mm"
          highlightToday={true}
          label={t('beginTime')}
          placeholder={t('beginTime')}
          clearable
        />
        <DateTimePicker
          valueFormat="DD.M.YYYY HH:mm"
          highlightToday={true}
          label={t('estimatedEndTime')}
          placeholder={t('estimatedEndTime')}
        />
        <DateTimePicker
          valueFormat="DD.M.YYYY HH:mm"
          highlightToday={true}
          label={t('overtimeThreshold')}
          placeholder={t('overtimeThreshold')}
        />
      </Stack>
    </form>
  );
}
