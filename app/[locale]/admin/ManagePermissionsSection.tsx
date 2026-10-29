'use client';

import { Enums } from '@/lib/types/database.types';
import {
  Button,
  Checkbox,
  Divider,
  Fieldset,
  Group,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useListState } from '@mantine/hooks';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export type PermissionItem = {
  label: string;
  checked: boolean;
  key: Enums<'permission'>;
};

type Props = {
  title: string;
  initialItems: PermissionItem[];
  username: string;
  handleSave(items: PermissionItem[]): Promise<void>;
  children?: React.ReactNode;
};

export default function ManagePermissionsSection({
  title,
  children,
  initialItems,
  username,
  handleSave,
}: Props) {
  const t = useTranslations('ManagePermissionsSection');
  const [updateIsPending, setUpdateIsPending] = useState(false);
  const [items, handlers] = useListState(initialItems);
  const allChecked = items.every((item) => item.checked);
  const indeterminate = items.some((item) => item.checked) && !allChecked;
  const unchanged = items.every(
    (item, index) => initialItems[index].checked === item.checked
  );
  const handleReset = () => {
    handlers.setState(initialItems);
  };
  return (
    <Fieldset disabled={updateIsPending}>
      <Stack>
        <Title size="h4">{title}</Title>
        {children}
        <Divider />
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>
                <Checkbox
                  variant="outline"
                  checked={allChecked}
                  indeterminate={indeterminate}
                  onChange={() =>
                    handlers.setState((current) =>
                      current.map((item) => ({
                        ...item,
                        checked: !allChecked,
                      }))
                    )
                  }
                />
              </Table.Th>
              <Table.Th>
                <Text c="dimmed">{t('user')}</Text>
                <Text fw={700}>{username}</Text>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {items.map((item, index) => (
              <Table.Tr key={item.key}>
                <Table.Td>
                  <Checkbox
                    checked={item.checked}
                    onChange={(event) => {
                      handlers.setItemProp(
                        index,
                        'checked',
                        event.currentTarget.checked
                      );
                    }}
                  />
                </Table.Td>
                <Table.Td>
                  <Text flex={1}>{item.label}</Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>{' '}
        <Group grow>
          <Button variant="outline" onClick={handleReset} disabled={unchanged}>
            {t('reset')}
          </Button>
          <Button
            onClick={async () => {
              setUpdateIsPending(true);
              await handleSave(items);
              setUpdateIsPending(false);
            }}
            disabled={unchanged}
            loading={updateIsPending}>
            {t('save')}
          </Button>
        </Group>
      </Stack>
    </Fieldset>
  );
}
