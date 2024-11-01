'use client';

import { ProgressBarLink } from '@/app/components/ProgressBar';
import { createClient } from '@/lib/supabase/client';
import { usePathname } from '@/navigation';
import { Table } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';
import { ControlledCheckbox } from './ControlledCheckbox';
import { usePortDataContext } from './PortDataContext';

export function LocationRows() {
  const { locations, setLocations } = usePortDataContext();
  const supabase = createClient();
  const t = useTranslations('LocationRows');
  const handleToggle = async (index: number, checked: boolean) => {
    const { data, error, status } = await supabase
      .from('locations')
      .update({ enabled: checked })
      .eq('locode', locations[index].locode)
      .select()
      .single();

    if (error) {
      showNotification({
        title: t('errorTitle'),
        message: t.rich('errorMessage', {
          status,
        }),
        icon: <IconExclamationMark stroke={1.5} />,
        color: 'red',
      });
      return;
    }

    setLocations((prevLocations) =>
      prevLocations.map((location, i) => (i === index ? data : location))
    );
  };
  const pathname = usePathname();
  return locations.map(({ locode, enabled, country, location_name }, index) => (
    <Table.Tr key={locode}>
      <Table.Td>
        <ControlledCheckbox
          enabled={enabled}
          index={index}
          onToggle={handleToggle}
        />
      </Table.Td>
      <Table.Td>{country}</Table.Td>
      <Table.Td>{location_name}</Table.Td>
      <Table.Td>
        <ProgressBarLink href={`${pathname}/${locode}`}>
          {locode}
        </ProgressBarLink>
      </Table.Td>
    </Table.Tr>
  ));
}
