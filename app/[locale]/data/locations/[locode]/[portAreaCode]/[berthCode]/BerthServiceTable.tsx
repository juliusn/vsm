'use client';

import { useDeleteServiceModal } from '@/app/[locale]/data/DeleteServiceModalContext';
import {
  PAGINATED_TABLE_PAGE_SIZE,
  PaginatedTable,
} from '@/app/components/PaginatedTable';
import { ServicePreview } from '@/app/components/ServicePreview';
import { useBerthServices } from '@/app/context/BerthServiceContext';
import { useEditServiceModal } from '@/app/context/EditServiceModalContext';
import {
  usePostgresErrorNotification,
  useServiceDeletedNotification,
  useServiceSavedNotification,
} from '@/app/hooks/notifications';
import { normalizeTranslations } from '@/lib/normalizers';
import { berthServicesSelector } from '@/lib/querySelectors';
import { createClient } from '@/lib/supabase/client';
import { Enums } from '@/lib/types/database.types';
import { BerthService } from '@/lib/types/query-types';
import { WithDictionary } from '@/lib/types/translation';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from '@hello-pangea/dnd';
import {
  ActionIcon,
  Center,
  Group,
  Radio,
  Switch,
  TableTd,
  Text,
  TextInput,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import {
  IconGripHorizontal,
  IconPencil,
  IconSearch,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { DataTableColumn, DataTableDraggableRow } from 'mantine-datatable';
import { useLocale, useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';

export function BerthServiceTable() {
  const t = useTranslations('ServicesTable');
  const locale = useLocale();
  const getErrorNotification = usePostgresErrorNotification();
  const getServiceDeletedNotification = useServiceDeletedNotification();
  const getServiceSavedNotification = useServiceSavedNotification();
  const supabase = createClient();
  const [titleEnQuery, setTitleEnQuery] = useState('');
  const [titleFiQuery, setTitleFiQuery] = useState('');
  const [enabledQuery, setEnabledQuery] = useState('all');
  const [page, setPage] = useState(1);
  const { openDeleteModal, closeDeleteModal } = useDeleteServiceModal();
  const { openEditModal, closeEditModal } = useEditServiceModal();
  const { berthServices, dispatch } = useBerthServices();

  const portEventLabels: Record<Enums<'port_event'>, string> = useMemo(
    () => ({
      arrival: t('arrival'),
      departure: t('departure'),
      shifting: t('shifting'),
    }),
    [t]
  );

  const {
    locode,
    portAreaCode,
    berthCode,
  }: { locode: string; portAreaCode: string; berthCode: string } = useParams();

  const servicesAtBerth = berthServices.filter(
    (service) =>
      service.locode === locode &&
      service.port_area_code === portAreaCode &&
      service.berth_code === berthCode
  );

  const filtersActive =
    titleEnQuery !== '' || titleFiQuery !== '' || enabledQuery !== 'all';

  const filteredBerthServices = servicesAtBerth
    .filter(
      (berthService) =>
        new RegExp(titleEnQuery, 'i').test(berthService.dictionary.en.title) &&
        new RegExp(titleFiQuery, 'i').test(berthService.dictionary.fi.title) &&
        (enabledQuery === 'all' ||
          (enabledQuery === 'enabled' && berthService.enabled) ||
          (enabledQuery === 'disabled' && !berthService.enabled))
    )
    .sort((a, b) => {
      if (a.sort_order !== null && b.sort_order !== null) {
        return a.sort_order - b.sort_order;
      }

      if (a.sort_order !== null) return -1;
      if (b.sort_order !== null) return 1;

      return a.dictionary[locale].title.localeCompare(
        b.dictionary[locale].title
      );
    });

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination || filtersActive) return;

    const items = Array.from(filteredBerthServices);
    const pageOffset = (page - 1) * PAGINATED_TABLE_PAGE_SIZE;
    const sourceIndex = pageOffset + result.source.index;
    const destinationIndex = pageOffset + result.destination.index;
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    const updatedServices = items.map((service, index) => ({
      id: service.id,
      locode: service.locode,
      port_area_code: service.port_area_code,
      berth_code: service.berth_code,
      enabled: service.enabled,
      port_event: service.port_event,
      sort_order: index,
    }));

    const { data, error, status } = await supabase
      .from('berth_services')
      .upsert(updatedServices)
      .select(berthServicesSelector)
      .order('sort_order');

    if (error) {
      showNotification(getErrorNotification(status));
      return;
    }

    const normalizedServices = normalizeTranslations<BerthService>(data);
    const otherServices = berthServices.filter(
      (service) =>
        service.locode !== locode ||
        service.port_area_code !== portAreaCode ||
        service.berth_code !== berthCode
    );

    dispatch({
      type: 'replaced',
      items: [...otherServices, ...normalizedServices],
    });
  };

  const columns: DataTableColumn<WithDictionary<BerthService>>[] = [
    { accessor: '', hiddenContent: true, width: 30 },
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
      accessor: 'port_event',
      title: t('portEvent'),
      render: ({ port_event }) => (
        <Text>{port_event ? portEventLabels[port_event] : ''}</Text>
      ),
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
              portEvent: service.port_event,
              onSave: async (translationEn, translationFi, portEvent) => {
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

                const berthServiceQuery = supabase
                  .from('berth_services')
                  .update({ port_event: portEvent })
                  .eq('id', service.id);

                const responses = await Promise.all([
                  queryEn,
                  queryFi,
                  berthServiceQuery,
                ]);

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
                    port_event: portEvent,
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <PaginatedTable
        allRecords={filteredBerthServices}
        columns={columns}
        onPageChanged={setPage}
        tableWrapper={({ children }) => (
          <Droppable droppableId="berth-services">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {children}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        rowFactory={({ record, index, rowProps, children }) => (
          <Draggable
            key={record.id}
            draggableId={record.id}
            index={index}
            isDragDisabled={filtersActive}>
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
