'use client';

import {
  APPROVAL_STATUSES,
  useApprovalStatus,
} from '@/app/hooks/approvalStatus';
import { Enums } from '@/lib/types/database.types';
import { ComboboxItem, Group, Select, SelectProps, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export default function ApprovalStatusSelect(props: SelectProps) {
  const { approvalStatusLabels, approvalStatusColors } = useApprovalStatus();

  const approvalStatusItems: ComboboxItem[] = APPROVAL_STATUSES.map(
    (status) => ({
      label: approvalStatusLabels[status],
      value: status,
    })
  );

  return (
    <Select
      data={approvalStatusItems}
      renderOption={({ option, checked }) => (
        <Group gap="xs">
          {checked && (
            <IconCheck
              stroke={4}
              size={14}
              style={{
                opacity: 0.4,
              }}
            />
          )}
          <Text
            size="sm"
            c={approvalStatusColors[option.value as Enums<'approval_status'>]}>
            {option.label}
          </Text>
        </Group>
      )}
      {...props}
    />
  );
}
