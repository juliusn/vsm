'use client';

import { ConfirmDeleteModal } from '@/app/components/ConfirmDeleteModal';
import { Button, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconTrash } from '@tabler/icons-react';
import { DateTimeFormatOptions, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useFormatter } from 'use-intl';
import { DockingRowData } from './DockingsTable';
import { createClient } from '@/lib/supabase/client';
import {
  useDockingDeletedNotification,
  usePostgresErrorNotification,
} from '@/app/hooks/notifications';
import { showNotification } from '@mantine/notifications';
import { useDockingsStore } from '@/app/store';

const dateTimeFormatOptions: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

const dateFormatOptions: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
};

interface DeleteDockingContentProps {
  data: DockingRowData;
  afterConfirm?: () => void;
}

export function DeleteDockingContent({
  data,
  afterConfirm,
}: DeleteDockingContentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const t1 = useTranslations('DeleteDockingContent');
  const t2 = useTranslations('DockingsTable');
  const supabase = createClient();
  const { removeDocking } = useDockingsStore();
  const getErrorNotification = usePostgresErrorNotification();
  const getDockingDeletedNotification = useDockingDeletedNotification();

  const format = useFormatter();
  const preview = (
    <Table
      captionSide="top"
      variant="vertical"
      styles={{ th: { backgroundColor: 'transparent' } }}>
      <Table.Caption>{t1('dockingDetails')}</Table.Caption>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>{t2('created')}</Table.Th>
          <Table.Td>
            {format.dateTime(new Date(data.created_at), dateTimeFormatOptions)}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t2('vesselImo')}</Table.Th>
          <Table.Td>{data.vessel_imo}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t2('berth')}</Table.Th>
          <Table.Td>{data.berth_code}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t2('arrival')}</Table.Th>
          <Table.Td>
            {data.arrival
              ? data.arrival.estimated_time
                ? format.dateTime(
                    new Date(
                      `${data.arrival.estimated_date}T${data.arrival.estimated_time}`
                    ),
                    dateTimeFormatOptions
                  )
                : format.dateTime(
                    new Date(data.arrival.estimated_date),
                    dateFormatOptions
                  )
              : t2('unknown')}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>{t2('departure')}</Table.Th>
          <Table.Td>
            {data.departure
              ? data.departure.estimated_time
                ? format.dateTime(
                    new Date(
                      `${data.departure.estimated_date}T${data.departure.estimated_time}`
                    ),
                    dateTimeFormatOptions
                  )
                : format.dateTime(
                    new Date(data.departure.estimated_date),
                    dateFormatOptions
                  )
              : t2('unknown')}
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );

  return (
    <>
      <Button
        onClick={open}
        variant="outline"
        color="red"
        leftSection={<IconTrash stroke={1.5} />}>
        {t1('label')}
      </Button>
      <ConfirmDeleteModal
        opened={opened}
        close={close}
        title={t1('label')}
        message={t1('modalMessage')}
        preview={preview}
        onConfirm={async () => {
          setLoading(true);

          const { error, status } = await supabase
            .from('dockings')
            .delete()
            .eq('id', data.id);

          setLoading(false);

          if (error) {
            showNotification(getErrorNotification(status));
            return;
          }

          removeDocking(data.id);
          showNotification(getDockingDeletedNotification());
          close();
          afterConfirm?.();
        }}
        loading={loading}
      />
    </>
  );
}
