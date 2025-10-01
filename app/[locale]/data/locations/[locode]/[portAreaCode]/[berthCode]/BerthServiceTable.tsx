'use client';

import { useDeleteServiceModal } from '@/app/[locale]/data/DeleteServiceModalContext';
import { PaginatedTable } from '@/app/components/PaginatedTable';
import { ServicePreview } from '@/app/components/ServicePreview';
import { useBerthServices } from '@/app/context/BerthServiceContext';
import { useEditServiceModal } from '@/app/context/EditServiceModalContext';
import {
  usePostgresErrorNotification,
  useServiceDeletedNotification,
  useServiceSavedNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { BerthService } from '@/lib/types/query-types';
import { WithDictionary } from '@/lib/types/translation';
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

export function BerthServiceTable() {
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
        new RegExp(titleEnQuery, 'i').test(berthService.dictionary.en.title) &&
        new RegExp(titleFiQuery, 'i').test(berthService.dictionary.fi.title) &&
        (enabledQuery === 'all' ||
          (enabledQuery === 'enabled' && berthService.enabled) ||
          (enabledQuery === 'disabled' && !berthService.enabled))
    )
    .sort((a, b) =>
      a.dictionary[locale].title.localeCompare(b.dictionary[locale].title)
    );

  const columns: DataTableColumn<WithDictionary<BerthService>>[] = [
    {
      accessor: 'translation.en',
      title: t('titleEn'),
      render: ({ dictionary }) => <Text>{dictionary.en.title}</Text>,
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
      accessor: 'translation.fi',
      title: t('titleFi'),
      render: ({ dictionary }) => <Text>{dictionary.fi.title}</Text>,
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
      render: (service) => (
        <Switch
          checked={service.enabled}
          onChange={async (event) => {
            const newChecked = event.currentTarget.checked;
            const { error, status } = await supabase
              .from('berth_services')
              .update({ enabled: newChecked })
              .eq('id', service.id);

            if (error) {
              showNotification(getErrorNotification(status));
              return;
            }

            dispatch({
              type: 'changed',
              item: {
                ...service,
                enabled: newChecked,
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
      render: ({ id, dictionary: { en, fi } }) => (
        <ActionIcon
          variant="transparent"
          color="red"
          aria-label={t('delete')}
          onClick={() => {
            openDeleteModal({
              previewContent: (
                <ServicePreview translationEn={en} translationFi={fi} />
              ),
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
      render: (service) => (
        <ActionIcon
          variant="transparent"
          aria-label={t('edit')}
          onClick={() => {
            openEditModal({
              title: t('editModalTitle'),
              translationEn: service.dictionary.en,
              translationFi: service.dictionary.fi,
              onSave: async (translationEn, translationFi) => {
                const queryEn = supabase
                  .from('berth_service_translations')
                  .update(translationEn)
                  .eq('locale', 'en')
                  .eq('berth_service', service.id);

                const queryFi = supabase
                  .from('berth_service_translations')
                  .update(translationFi)
                  .eq('locale', 'fi')
                  .eq('berth_service', service.id);

                const responses = await Promise.all([queryEn, queryFi]);

                for (const response of responses) {
                  if (response.error) {
                    showNotification(getErrorNotification(response.status));
                    return;
                  }
                }

                dispatch({
                  type: 'changed',
                  item: {
                    ...service,
                    dictionary: { en: translationEn, fi: translationFi },
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
