'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { ServicePreview } from '@/app/components/ServicePreview';
import { useCommonServices } from '@/app/context/CommonServiceContext';
import {
  usePostgresErrorNotification,
  useServiceDeletedNotification,
  useServiceSavedNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { CommonService } from '@/lib/types/query-types';
import { WithDictionary } from '@/lib/types/translation';
import { ActionIcon, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconPencil, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { useEditServiceModal } from '../../../context/EditServiceModalContext';
import { useDeleteServiceModal } from '../DeleteServiceModalContext';

export function CommonServiceTable() {
  const t = useTranslations('CommonServiceTable');
  const locale = useLocale() as AppTypes.Locale;
  const getErrorNotification = usePostgresErrorNotification();
  const getServiceDeletedNotification = useServiceDeletedNotification();
  const getServiceUpdatedNotification = useServiceSavedNotification();
  const supabase = createClient();
  const [titleEnQuery, setTitleEnQuery] = useState('');
  const [abbrvEnQuery, setAbbrvEnQuery] = useState('');
  const [titleFiQuery, setTitleFiQuery] = useState('');
  const [abbrvFiQuery, setAbbrvFiQuery] = useState('');
  const { openDeleteModal, closeDeleteModal } = useDeleteServiceModal();
  const { openEditModal, closeEditModal } = useEditServiceModal();
  const { commonServices, dispatch } = useCommonServices();

  const filterByQueries = (service: WithDictionary<CommonService>): boolean =>
    new RegExp(titleEnQuery, 'i').test(service.dictionary.en.title) &&
    new RegExp(titleFiQuery, 'i').test(service.dictionary.fi.title) &&
    new RegExp(abbrvEnQuery, 'i').test(service.dictionary.en.abbreviation) &&
    new RegExp(abbrvFiQuery, 'i').test(service.dictionary.fi.abbreviation);

  const filteredCommonServices = commonServices
    .filter(filterByQueries)
    .sort((a, b) =>
      a.dictionary[locale].title.localeCompare(b.dictionary[locale].title)
    );

  const columns: DataTableColumn<WithDictionary<CommonService>>[] = [
    {
      accessor: 'dictionary.en.en',
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
      accessor: 'dictionary.en.abbreviation',
      title: t('abbrvEn'),
      render: ({ dictionary }) => <Text>{dictionary.en.abbreviation}</Text>,
      filter: (
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setAbbrvEnQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={abbrvEnQuery}
          onChange={(e) => setAbbrvEnQuery(e.currentTarget.value)}
        />
      ),
      filtering: abbrvEnQuery !== '',
    },
    {
      accessor: 'dictionary.fi.title',
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
      accessor: 'dictionary.fi.abbreviation',
      title: t('abbrvFi'),
      render: ({ dictionary }) => <Text>{dictionary.fi.abbreviation}</Text>,
      filter: (
        <TextInput
          leftSection={<IconSearch size={16} />}
          rightSection={
            <ActionIcon
              size="sm"
              variant="transparent"
              c="dimmed"
              onClick={() => setAbbrvFiQuery('')}>
              <IconX size={14} />
            </ActionIcon>
          }
          value={abbrvFiQuery}
          onChange={(e) => setAbbrvFiQuery(e.currentTarget.value)}
        />
      ),
      filtering: abbrvFiQuery !== '',
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
                  .from('common_services')
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
                  .from('common_service_translations')
                  .update({
                    title: translationEn.title,
                    abbreviation: translationEn.abbreviation,
                  })
                  .eq('locale', 'en')
                  .eq('common_service', service.id);

                const queryFi = supabase
                  .from('common_service_translations')
                  .update({
                    title: translationFi.title,
                    abbreviation: translationFi.abbreviation,
                  })
                  .eq('locale', 'fi')
                  .eq('common_service', service.id);

                const translationResponses = await Promise.all([
                  queryEn,
                  queryFi,
                ]);

                for (const response of translationResponses) {
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

                showNotification(getServiceUpdatedNotification());
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
    <PaginatedTable allRecords={filteredCommonServices} columns={columns} />
  );
}
