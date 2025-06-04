'use client';

import { Switch, SwitchProps } from '@mantine/core';
import { useTranslations } from 'next-intl';

type EnabledSwitchProps = Pick<SwitchProps, 'checked' | 'onChange'>;

export function EnabledSwitch(props: EnabledSwitchProps) {
  const t = useTranslations('EnabledSwitch');
  return <Switch label={t('label')} {...props} />;
}
