'use client';

import { PaginatedTable } from '@/app/components/PaginatedTable';
import { ServicePreview } from '@/app/components/ServicePreview';
import {
  SortableCommonService,
  useCommonServices,
} from '@/app/context/CommonServiceContext';
import {
  usePostgresErrorNotification,
  useServiceDeletedNotification,
  useServiceSavedNotification,
} from '@/app/hooks/notifications';
import { normalizeSortables, normalizeTranslations } from '@/lib/normalizers';
import { commonServicesSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { WithDictionary } from '@/lib/types/translation';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import { ActionIcon, Center, TableTd, Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconGripHorizontal, IconPencil, IconTrash } from '@tabler/icons-react';
import { DataTableColumn, DataTableDraggableRow } from 'mantine-datatable';
import { useTranslations } from 'next-intl';
import { useEditServiceModal } from '../../../context/EditServiceModalContext';
import { useDeleteServiceModal } from '../DeleteServiceModalContext';

export function CommonServiceTable() {
  const t = useTranslations('CommonServiceTable');
  const getErrorNotification = usePostgresErrorNotification();
  const getServiceDeletedNotification = useServiceDeletedNotification();
  const getServiceUpdatedNotification = useServiceSavedNotification();
  const supabase = createClient();
  const { openDeleteModal, closeDeleteModal } = useDeleteServiceModal();
  const { openEditModal, closeEditModal } = useEditServiceModal();
  const { commonServices, dispatch } = useCommonServices();

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(commonServices);
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);
    const updatedServices = items.map((service, index) => ({
      id: service.id,
      sort_order: index,
    }));

    const { data, error, status } = await supabase
      .from('common_services')
      .upsert(updatedServices)
      .select(commonServicesSelector)
      .order('sort_order');

    if (error) {
      showNotification(getErrorNotification(status));
      return;
    }

    const sortableServices = normalizeSortables(data);

    const normalizedServices =
      normalizeTranslations<SortableCommonService>(sortableServices);

    dispatch({ type: 'replaced', items: normalizedServices });
  };

  const columns: DataTableColumn<WithDictionary<SortableCommonService>>[] = [
    { accessor: '', hiddenContent: true, width: 30 },
    {
      accessor: 'dictionary.en.en',
      title: t('titleEn'),
      render: ({ dictionary }) => <Text>{dictionary.en.title}</Text>,
    },
    {
      accessor: 'dictionary.en.abbreviation',
      title: t('abbrvEn'),
      render: ({ dictionary }) => <Text>{dictionary.en.abbreviation}</Text>,
    },
    {
      accessor: 'dictionary.fi.title',
      title: t('titleFi'),
      render: ({ dictionary }) => <Text>{dictionary.fi.title}</Text>,
    },
    {
      accessor: 'dictionary.fi.abbreviation',
      title: t('abbrvFi'),
      render: ({ dictionary }) => <Text>{dictionary.fi.abbreviation}</Text>,
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <PaginatedTable<WithDictionary<SortableCommonService>>
        allRecords={commonServices}
        columns={columns}
        tableWrapper={({ children }) => (
          <Droppable droppableId="datatable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {children}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        rowFactory={({ record, index, rowProps, children }) => (
          <Draggable key={record.id} draggableId={record.id} index={index}>
            {(provided, snapshot) => (
              <DataTableDraggableRow
                isDragging={snapshot.isDragging}
                {...rowProps}
                {...provided.draggableProps}>
                <TableTd>
                  <Center {...provided.dragHandleProps} ref={provided.innerRef}>
                    <IconGripHorizontal size={16} />
                  </Center>
                </TableTd>
                {children}
              </DataTableDraggableRow>
            )}
          </Draggable>
        )}
      />
    </DragDropContext>
  );
}
