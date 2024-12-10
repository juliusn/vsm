'use client';

import { ServicePreview } from '@/app/components/ServicePreview';
import {
  useErrorNotification,
  useServiceDeletedNotification,
  useServiceSavedNotification,
} from '@/app/hooks/notifications';
import { createClient } from '@/lib/supabase/client';
import { ActionIcon, Text, TextInput } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconPencil, IconSearch, IconTrash, IconX } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useDeleteServiceModal } from '../DeleteServiceModalContext';
import { useEditServiceModal } from '../EditServicesModalContext';
import { ActionTypes, useCommonServices } from './CommonServicesContext';

const PAGE_SIZE = 15;

export function CommonServicesTable() {
  const t = useTranslations('CommonServicesTable');
  const locale = useLocale() as AppTypes.Locale;
  const getErrorNotification = useErrorNotification();
  const getServiceDeletedNotification = useServiceDeletedNotification();
  const getServiceUpdatedNotification = useServiceSavedNotification();
  const supabase = createClient();
  const [page, setPage] = useState(1);
  const [titleEnQuery, setTitleEnQuery] = useState('');
  const [titleFiQuery, setTitleFiQuery] = useState('');
  const { openDeleteModal, closeDeleteModal } = useDeleteServiceModal();
  const { openEditModal, closeEditModal } = useEditServiceModal();
  const { services, dispatch } = useCommonServices();
  const records = services
    .filter(
      (service) =>
        new RegExp(titleEnQuery, 'i').test(service.titles['en']) &&
        new RegExp(titleFiQuery, 'i').test(service.titles['fi'])
    )
    .sort((a, b) => a.titles[locale].localeCompare(b.titles[locale]))
    .slice((page - 1) * PAGE_SIZE, (page - 1) * PAGE_SIZE + PAGE_SIZE);
  useEffect(() => {
    const fetchServices = async () => {
      const { data, error, status } = await supabase
        .from('common_services')
        .select();

      if (error) {
        showNotification(getErrorNotification(status));
        return;
      }

      dispatch({
        type: ActionTypes.SET_SERVICES,
        payload: { services: data as AppTypes.CommonService[] },
      });
    };

    fetchServices();
  }, [supabase, getErrorNotification, dispatch]);

  return (
    <DataTable
      withTableBorder
      borderRadius="sm"
      minHeight={records.length ? 0 : 180}
      noRecordsText={t('noResults')}
      totalRecords={services.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={setPage}
      records={records}
      columns={[
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
                      .from('common_services')
                      .delete()
                      .eq('id', id);

                    if (error) {
                      showNotification(getErrorNotification(status));
                      return;
                    }

                    dispatch({
                      type: ActionTypes.REMOVE_SERVICE,
                      payload: {
                        id,
                      },
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
                  serviceTitles: service.titles,
                  onSave: async (titles) => {
                    const { data, error, status } = await supabase
                      .from('common_services')
                      .update({
                        titles,
                      })
                      .eq('id', service.id)
                      .select()
                      .single();

                    if (error) {
                      showNotification(getErrorNotification(status));
                      return;
                    }

                    dispatch({
                      type: ActionTypes.UPDATE_SERVICE,
                      payload: { service: data as AppTypes.CommonService },
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
      ]}
    />
  );
}
