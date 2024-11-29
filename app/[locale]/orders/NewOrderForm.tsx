'use client';

import {
  ComboboxItem,
  ComboboxItemGroup,
  MultiSelect,
  Select,
  Stack,
  useComputedColorScheme,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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

type PortAreaIdentifier = {
  locode: string;
  port_area_code: string;
};

type BerthIdentifier = {
  locode: string;
  port_area_code: string;
  berth_code: string;
};

export function NewOrderForm({
  locations,
  portAreas,
  berths,
}: {
  locations: AppTypes.Location[];
  portAreas: AppTypes.PortArea[];
  berths: AppTypes.Berth[];
}) {
  const t = useTranslations('NewOrderForm');
  const colorScheme = useComputedColorScheme();
  const [locode, setLocode] = useState<string | null>(null);
  const locationsData = locations.map(
    ({ locode, location_name }): ComboboxItem => ({
      value: locode,
      label: location_name,
    })
  );
  const [portAreaId, setPortAreaId] = useState<PortAreaIdentifier | null>(null);
  const [berthId, setBerthId] = useState<BerthIdentifier | null>(null);
  const portArea = portAreaId ? JSON.stringify(portAreaId) : null;
  const berth = berthId ? JSON.stringify(berthId) : null;

  const filteredPortAreas = portAreas.filter((portArea) =>
    locode ? portArea.locode === locode : true
  );

  const filteredPortAreaLocationNames = filteredPortAreas.map(
    ({ locode }) =>
      locations.find((location) => location.locode === locode)?.location_name
  );

  const portAreaData = locations.map(
    ({ locode, location_name }): ComboboxItemGroup => ({
      group: location_name,
      items: filteredPortAreas
        .filter((portArea) => portArea.locode === locode)
        .map(
          ({ locode, port_area_code, port_area_name }): ComboboxItem => ({
            value: JSON.stringify({ locode, port_area_code }),
            label: `${port_area_code} - ${port_area_name}`,
          })
        ),
    })
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

  const allTaskItems = taskItems.flatMap((group) => group.items);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const handleTaskOptionsChange = (values: string[]) => {
    const orderedValues = values.sort(
      (a, b) =>
        allTaskItems.findIndex((item) => item.value === a) -
        allTaskItems.findIndex((item) => item.value === b)
    );
    setSelectedTasks(orderedValues);
  };

  return (
    <form>
      <Stack>
        <Select
          data={locationsData}
          value={locode}
          label={t('location')}
          placeholder={t('selectLocation')}
          searchable
          clearable
          onChange={(value) => {
            setLocode(value);
            if (!value) {
              setPortAreaId(null);
              setBerthId(null);
            }
          }}
        />
        <Select
          data={portAreaData}
          value={portArea}
          label={t('portArea')}
          placeholder={t('selectPortArea')}
          searchable
          clearable
          onChange={(value) => {
            if (value) {
              const portArea: PortAreaIdentifier = JSON.parse(value);
              setPortAreaId(portArea);
              setLocode(portArea.locode);
            } else {
              setPortAreaId(null);
              setBerthId(null);
            }
          }}
          styles={(theme) => ({
            groupLabel: {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              boxShadow: theme.shadows.xs,
              backgroundColor:
                colorScheme === 'light' ? theme.white : theme.colors.dark[6],
            },
          })}
        />
        <Select
          data={berthsData}
          value={berth}
          label={t('berth')}
          placeholder={t('selectBerth')}
          searchable
          clearable
          onChange={(value) => {
            if (value) {
              const berth: BerthIdentifier = JSON.parse(value);
              const { locode, port_area_code } = berth;
              setLocode(locode);
              setPortAreaId({ locode, port_area_code });
              setBerthId(berth);
            } else {
              setBerthId(null);
            }
          }}
          styles={(theme) => ({
            groupLabel: {
              position: 'sticky',
              top: 0,
              zIndex: 1,
              boxShadow: theme.shadows.xs,
              backgroundColor:
                colorScheme === 'light' ? theme.white : theme.colors.dark[6],
            },
          })}
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
          styles={{
            pillsList: {
              display: 'inline',
            },
            pill: { justifyContent: 'space-between' },
          }}
          value={selectedTasks}
          onChange={handleTaskOptionsChange}
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
