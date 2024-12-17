import { ComboboxItem, ComboboxItemGroup, MultiSelect } from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function BerthServiceSelect({
  taskItems,
}: {
  taskItems: ComboboxItemGroup<ComboboxItem>[];
}) {
  const t = useTranslations('BerthServiceSelect');
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
  );
}
