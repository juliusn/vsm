'use client';

import { createClient } from '@/lib/supabase/client';
import { PortsApiResponse } from '@/lib/types/ports-api.types';
import { useRouter } from '@/i18n/routing';
import { Button, Group, Modal, Stack, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import {
  IconAlertTriangle,
  IconCheck,
  IconExclamationMark,
} from '@tabler/icons-react';
import {
  DateTimeFormatOptions,
  useFormatter,
  useTranslations,
} from 'next-intl';
import { useState } from 'react';
import { DeleteAllButton } from './DeleteAllButton';
import { UpdateAllButton } from './UpdateAllButton';
type DatasetName = 'port_data' | 'locations' | 'port_areas' | 'berths';
type DateComparisonResult = {
  datesMatch: boolean | null;
};
const datasets: DatasetName[] = [
  'locations',
  'port_areas',
  'berths',
  'port_data',
];
interface DatasetRow {
  datasetName: React.ReactNode;
  apiUpdatedTime: React.ReactNode;
  dbUpdatedTime: React.ReactNode;
  comparisonResult: React.ReactNode;
}

export function UpdatePortData() {
  const [rows, setRows] = useState<DatasetRow[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<PortsApiResponse>();
  const apiLocations =
    apiData?.ssnLocations.features.map((location) => ({
      enabled: true,
      country: location.properties.country,
      location_name: location.properties.locationName,
      locode: location.properties.locode,
    })) || [];
  const apiPortAreas =
    apiData?.portAreas.features.map(
      (portArea): AppTypes.PortArea => ({
        enabled: true,
        port_area_code: portArea.portAreaCode,
        port_area_name: portArea.properties.portAreaName,
        locode: portArea.properties.locode,
        geometry: portArea.geometry,
      })
    ) || [];
  const apiBerths =
    apiData?.berths.berths.map(
      (berth): AppTypes.Berth => ({
        enabled: true,
        berth_code: berth.berthCode,
        berth_name: berth.berthName,
        port_area_code: berth.portAreaCode,
        locode: berth.locode,
      })
    ) || [];
  const tableRows = rows?.map(
    ({ datasetName, apiUpdatedTime, dbUpdatedTime, comparisonResult }, i) => (
      <Table.Tr key={i}>
        <Table.Td>{datasetName}</Table.Td>
        <Table.Td>{apiUpdatedTime}</Table.Td>
        <Table.Td>{dbUpdatedTime}</Table.Td>
        <Table.Td>{comparisonResult}</Table.Td>
      </Table.Tr>
    )
  );
  const [apiUpdateTimes, setApiUpdateTimes] = useState<string[]>([]);
  const formatter = useFormatter();
  const formatOptions: DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  const [opened, { open, close }] = useDisclosure(false);
  const t = useTranslations('UpdatePortData');
  const supabase = createClient();
  const router = useRouter();

  const requestData = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    setLoading(true);

    const apiResponse = await fetch(
      'https://meri.digitraffic.fi/api/port-call/v1/ports'
    );

    if (!apiResponse.ok) {
      throw new Error(`API responded with status ${apiResponse.status}`);
    }

    const portData: PortsApiResponse = await apiResponse.json();

    setApiData(portData);

    const apiUpdateTimes = [
      portData.dataUpdatedTime,
      portData.ssnLocations.dataUpdatedTime,
      portData.portAreas.dataUpdatedTime,
      portData.berths.dataUpdatedTime,
    ];

    setApiUpdateTimes(apiUpdateTimes);

    const responses = await Promise.all(
      datasets.map((dataset) =>
        supabase
          .from('metadata')
          .select('*')
          .eq('dataset_name', dataset)
          .maybeSingle()
      )
    );

    const comparisonResults = responses.map(
      (response, i): DateComparisonResult => ({
        datesMatch: response.data
          ? new Date(apiUpdateTimes[i]).getTime() ===
            new Date(response.data.data_updated_time).getTime()
          : null,
      })
    );

    setRows(
      responses.map(
        ({ data, error }, i): DatasetRow => ({
          datasetName: datasets[i],
          apiUpdatedTime: formatter.dateTime(
            new Date(apiUpdateTimes[i]),
            formatOptions
          ),
          dbUpdatedTime:
            data &&
            formatter.dateTime(new Date(data.data_updated_time), formatOptions),
          comparisonResult: data ? (
            comparisonResults[i].datesMatch ? (
              <Group color="green">
                <IconCheck stroke={1.5} color="green" />
                {t('datesMatch')}
              </Group>
            ) : (
              <Group>
                <IconAlertTriangle stroke={1.5} color="red" />
                {t('datesMismatch')}
              </Group>
            )
          ) : error ? (
            t('error')
          ) : (
            t('notFound')
          ),
        })
      )
    );
    setLoading(false);
    open();
  };

  const updateAll = async () => {
    const updateQueries = [
      {
        label: t('locations'),
        query: async () => {
          const { error, status } = await supabase.from('locations').upsert(
            apiLocations.map(({ country, location_name, locode }) => ({
              country,
              location_name,
              locode,
            }))
          );
          return { error, status };
        },
      },
      {
        label: t('portAreas'),
        query: () =>
          supabase.from('port_areas').upsert(
            apiPortAreas.map(
              ({ geometry, locode, port_area_code, port_area_name }) => ({
                geometry,
                locode,
                port_area_code,
                port_area_name,
              })
            )
          ),
      },
      {
        label: t('berths'),
        query: () =>
          supabase.from('berths').upsert(
            apiBerths.map(
              ({ berth_code, berth_name, locode, port_area_code }) => ({
                berth_code,
                berth_name,
                locode,
                port_area_code,
              })
            )
          ),
      },
      {
        label: t('metadata'),
        query: () =>
          supabase.from('metadata').upsert(
            datasets.map((dataset, i) => ({
              dataset_name: dataset,
              data_updated_time: apiUpdateTimes[i],
            }))
          ),
      },
    ];
    for (const { label, query } of updateQueries) {
      const { error, status } = await query();
      if (error) {
        showNotification({
          title: t('errorLabel'),
          message: t.rich('updateErrorMessage', {
            label,
            status,
          }),
          icon: <IconExclamationMark stroke={1.5} />,
          color: 'red',
        });
        return;
      }
    }
    showNotification({
      title: t('successLabel'),
      message: t('updateSuccessMessage'),
      icon: <IconCheck stroke={1.5} />,
      color: 'green',
    });
    router.refresh();
  };

  const deleteAll = async () => {
    const deleteQueries = [
      {
        label: t('berths'),
        query: () => supabase.from('berths').delete().neq('berth_code', null),
      },
      {
        label: t('portAreas'),
        query: () =>
          supabase.from('port_areas').delete().neq('port_area_code', null),
      },
      {
        label: t('locations'),
        query: async () => {
          const { error, status } = await supabase
            .from('locations')
            .delete()
            .neq('locode', null);
          return { error, status };
        },
      },
      {
        label: t('metadata'),
        query: () =>
          supabase.from('metadata').delete().in('dataset_name', datasets),
      },
    ];
    for (const { label, query } of deleteQueries) {
      const { error, status } = await query();
      if (error) {
        showNotification({
          title: t('errorLabel'),
          message: t.rich('deleteErrorMessage', {
            label,
            status,
          }),
          icon: <IconExclamationMark stroke={1.5} />,
          color: 'red',
        });
        return;
      }
    }
    showNotification({
      title: t('successLabel'),
      message: t('deleteSuccessMessage'),
      icon: <IconCheck stroke={1.5} />,
      color: 'green',
    });
    router.refresh();
  };

  return (
    <>
      <Group>
        <Button loading={loading} onClick={requestData}>
          {t('updateDatabase')}
        </Button>
      </Group>
      <Modal
        opened={opened}
        onClose={close}
        title={t('updateDatabase')}
        size="auto">
        <Stack>
          <Group>
            <UpdateAllButton callback={updateAll} />
            <DeleteAllButton callback={deleteAll} />
          </Group>
          <Table captionSide="top">
            <Table.Caption>{t('results')}</Table.Caption>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>{t('datasetName')}</Table.Th>
                <Table.Th>{t('dateUpdatedApi')}</Table.Th>
                <Table.Th>{t('dateUpdatedDb')}</Table.Th>
                <Table.Th>{t('result')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{tableRows}</Table.Tbody>
          </Table>
        </Stack>
      </Modal>
    </>
  );
}
