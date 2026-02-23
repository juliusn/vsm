import { Enums } from '@/lib/types/database.types';
import {
  DefaultMantineColor,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type ApprovalStatus = Enums<'approval_status'>;

const keys: Record<ApprovalStatus, true> = {
  pending: true,
  approved: true,
  rejected: true,
};

export const approvalStatuses = Object.keys(keys) as ApprovalStatus[];

const approvalStatusSortOrder: Record<ApprovalStatus, number> = {
  pending: 0,
  approved: 1,
  rejected: 2,
};

export const useApprovalStatus = () => {
  const t = useTranslations('useApprovalStatus');
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const shade = colorScheme === 'light' ? 8 : 6;

  const approvalStatusLabels: Record<ApprovalStatus, string> = useMemo(
    () => ({
      pending: t('pending'),
      approved: t('approved'),
      rejected: t('rejected'),
    }),
    [t]
  );

  const approvalStatusColors: Record<ApprovalStatus, DefaultMantineColor> =
    useMemo(
      () => ({
        pending: theme.colors.yellow[shade],
        approved: theme.colors.green[shade],
        rejected: theme.colors.red[shade],
      }),
      [theme, shade]
    );

  return {
    approvalStatusLabels,
    approvalStatusColors,
    approvalStatusSortOrder,
  };
};
