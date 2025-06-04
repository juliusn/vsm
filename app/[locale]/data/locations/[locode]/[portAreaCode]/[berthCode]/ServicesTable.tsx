'use client';

import { useDeleteServiceModal } from '@/app/[locale]/data/DeleteServiceModalContext';
import { useEditServiceModal } from '@/app/[locale]/data/EditServicesModalContext';
import { PaginatedTable } from '@/app/components/PaginatedTable';
import { ServicePreview } from '@/app/components/ServicePreview';
import { useBerthServices } from '@/app/context/BerthServiceContext';
import {
  usePostgresErrorNotification,
  useServiceDeletedNotification,
  useServiceSavedNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import {
  ActionIcon,
  Group,
  Radio,
  Switch,
  Text,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconPencil, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export function ServicesTable() {
  const t = useTranslations('ServicesTable');
  const locale = useLocale() as AppTypes.Locale;
  const getErrorNotification = usePostgresErrorNotification();
  const getServiceDeletedNotification = useServiceDeletedNotification();
  const getServiceSavedNotification = useServiceSavedNotification();
  const supabase = createClient();
  const [titleEnQuery, setTitleEnQuery] = useState('');
  const [titleFiQuery, setTitleFiQuery] = useState('');
  const [enabledQuery, setEnabledQuery] = useState('all');
  const { openDeleteModal, closeDeleteModal } = useDeleteServiceModal();
  const { openEditModal, closeEditModal } = useEditServiceModal();
  const { berthServices, dispatch } = useBerthServices();

  const {
    locode,
    portAreaCode,
    berthCode,
  }: { locode: string; portAreaCode: string; berthCode: string } = useParams();

  const filteredBerthServices = berthServices
    .filter(
      (berthService) =>
        berthService.locode === locode &&
        berthService.port_area_code === portAreaCode &&
        berthService.berth_code === berthCode &&
        new RegExp(titleEnQuery, 'i').test(berthService.titles['en']) &&
        new RegExp(titleFiQuery, 'i').test(berthService.titles['fi']) &&
        (enabledQuery === 'all' ||
          (enabledQuery === 'enabled' && berthService.enabled) ||
          (enabledQuery === 'disabled' && !berthService.enabled))
    )
    .sort((a, b) => a.titles[locale].localeCompare(b.titles[locale]));

  const columns: DataTableColumn<AppTypes.BerthService>[] = [
    {
      accessor: 'titles.en',
      title: t('titleEn'),
      render: ({ titles }) => <Text>{titles['en']}</Text>,
      filter: (
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setTitleEnQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={titleEnQuery}
          onChange={(e) => setTitleEnQuery(e.currentTarget.value)}
        />
      ),
      filtering: titleEnQuery !== '',
    },
    {
      accessor: 'titles.fi',
      title: t('titleFi'),
      render: ({ titles }) => <Text>{titles['fi']}</Text>,
      filter: (
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setTitleFiQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={titleFiQuery}
          onChange={(e) => setTitleFiQuery(e.currentTarget.value)}
        />
      ),
      filtering: titleFiQuery !== '',
    },
    {
      accessor: 'enabled',
      title: t('enabled'),
      render: ({ id, enabled }) => (
        <Switch
          checked={enabled}
          onChange={async (event) => {
            const newChecked = event.currentTarget.checked;
            const { data, error, status } = await supabase
              .from('berth_services')
              .update({ enabled: newChecked })
              .eq('id', id)
              .select()
              .single();

            if (error) {
              showNotification(getErrorNotification(status));
              return;
            }

            dispatch({
              type: 'changed',
              item: {
                ...data,
                titles: data.titles as AppTypes.ServiceTitles,
              },
            });
          }}
        />
      ),
      filter: (
        <Radio.Group value={enabledQuery} onChange={setEnabledQuery}>
          <Group>
            <Radio value="all" label={t('all')} />
            <Radio value="enabled" label={t('yes')} />
            <Radio value="disabled" label={t('no')} />
          </Group>
        </Radio.Group>
      ),
      filtering: enabledQuery !== 'all',
    },
    {
      accessor: 'delete',
      title: t('delete'),
      render: ({ id, titles }) => (
        <ActionIcon
          variant="transparent"
          color="red"
          aria-label={t('delete')}
          onClick={() => {
            openDeleteModal({
              previewContent: <ServicePreview titles={titles} />,
              onConfirm: async () => {
                const { error, status } = await supabase
                  .from('berth_services')
                  .delete()
                  .eq('id', id);

                if (error) {
                  showNotification(getErrorNotification(status));
                  return;
                }

                dispatch({
                  type: 'deleted',
                  id,
                });

                showNotification(getServiceDeletedNotification());
                closeDeleteModal();
              },
            });
          }}>
          <IconTrash stroke={1.5} />
        </ActionIcon>
      ),
    },
    {
      accessor: 'edit',
      title: t('edit'),
      render: ({ id, titles }) => (
        <ActionIcon
          variant="transparent"
          aria-label={t('edit')}
          onClick={() => {
            openEditModal({
              title: t('editModalTitle'),
              serviceTitles: titles,
              onSave: async (titles) => {
                const { data, error, status } = await supabase
                  .from('berth_services')
                  .update({
                    titles,
                  })
                  .eq('id', id)
                  .select()
                  .single();

                if (error) {
                  showNotification(getErrorNotification(status));
                  return;
                }

                dispatch({
                  type: 'changed',
                  item: {
                    ...data,
                    titles: data.titles as AppTypes.ServiceTitles,
                  },
                });

                showNotification(getServiceSavedNotification());
                closeEditModal();
              },
            });
          }}>
          <IconPencil stroke={1.5} />
        </ActionIcon>
      ),
    },
  ];

  return (
    <PaginatedTable allRecords={filteredBerthServices} columns={columns} />
  );
}
