'use client';

import { DockingPreview } from '@/app/components/DockingPreview';
import { DockingRowData } from '@/lib/types/docking';
import {
  Button,
  Collapse,
  Fieldset,
  Group,
  Modal,
  Paper,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAnchor } from '@tabler/icons-react';
import 'dayjs/locale/fi';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { SelectDockingTable } from './SelectDockingTable';
import { NewDockingForm } from '../port-traffic/NewDockingForm';

export function NewOrderForm({ close }: { close(): void }) {
  const t = useTranslations('NewOrderForm');
  const [docking, setDocking] = useState<DockingRowData | null>(null);
  const [preview, setPreview] = useState<DockingRowData | null>(null);
  const [
    selectDockingOpened,
    { open: openSelectDocking, close: closeSelectDocking },
  ] = useDisclosure();
  const [newDockingOpened, { open: openNewDocking, close: closeNewDocking }] =
    useDisclosure();

  return (
    <form>
      <Modal
        size="auto"
        opened={selectDockingOpened}
        onClose={closeSelectDocking}
        title={t('selectDocking')}>
        <SelectDockingTable
          onRowClick={({ record }) => {
            setDocking(record);
            setPreview(record);
            closeSelectDocking();
          }}
        />
      </Modal>
      <Modal
        opened={newDockingOpened}
        onClose={closeNewDocking}
        title={t('createNewDocking')}>
        <NewDockingForm
          close={closeNewDocking}
          resultCallback={(data) => {
            setDocking(data);
            setPreview(data);
          }}
        />
      </Modal>
      <Stack>
        <Fieldset
          legend={
            <Group>
              <IconAnchor size={20} color="var(--mantine-color-blue-5)" />
              <Text>{t('docking')}</Text>
            </Group>
          }>
          <Stack>
            <Group grow>
              <Button
                variant="outline"
                onClick={() => {
                  openNewDocking();
                }}>
                {t('create')}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  openSelectDocking();
                }}>
                {t('select')}
              </Button>
              <Button
                variant="default"
                disabled={!docking}
                onClick={() => {
                  setDocking(null);
                }}>
                {t('removeSelection')}
              </Button>
            </Group>
            <Collapse in={!!docking}>
              <Paper withBorder shadow="sm">
                {preview && <DockingPreview data={preview} />}
              </Paper>
            </Collapse>
          </Stack>
        </Fieldset>
        <Select label={t('service')} placeholder={t('selectService')} />
        <Group grow>
          <Button variant="outline" onClick={close}>
            {t('cancelButtonLabel')}
          </Button>
          <Button type="submit">{t('saveButtonLabel')}</Button>
        </Group>
      </Stack>
    </form>
  );
}
