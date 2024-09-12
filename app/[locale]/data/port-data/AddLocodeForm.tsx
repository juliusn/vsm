'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from '@/navigation';
import { Autocomplete, Button, Stack } from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

interface FormValues {
  locode: string;
}

export default function AddLocodeForm({
  existingLocodes,
  addedLocodes,
  closeModal,
}: {
  existingLocodes: string[];
  addedLocodes: string[];
  closeModal: () => void;
}) {
  const router = useRouter();
  const t = useTranslations('AddLocodeForm');
  const supabase = createClient();
  const form = useForm<FormValues>({
    initialValues: {
      locode: '',
    },
    validate: {
      locode: (value) =>
        addedLocodes.includes(value) ? t('inputError') : null,
    },
    validateInputOnChange: true,
  });

  return (
    <form
      onSubmit={form.onSubmit(async ({ locode }) => {
        const { status } = await supabase.from('locodes').insert({ locode });
        if (status === 201) {
          showNotification({
            title: t('201Title'),
            message: t('201Message'),
            icon: <IconCheck stroke={1.5} />,
            color: 'green',
          });
          closeModal();
          router.refresh();
        } else if (status === 409) {
          showNotification({
            title: t('errorTitle'),
            message: t('409Message'),
            icon: <IconExclamationMark stroke={1.5} />,
            color: 'red',
          });
        } else {
          showNotification({
            title: t('errorTitle'),
            message: t.rich('errorMessage', {
              status,
            }),
            icon: <IconExclamationMark stroke={1.5} />,
            color: 'red',
          });
        }
      })}>
      <Stack>
        <Autocomplete
          placeholder={t('inputPlaceholder')}
          data={existingLocodes}
          {...form.getInputProps('locode')}
          onChange={(value) =>
            form.setFieldValue(
              'locode',
              value
                .toUpperCase()
                .replace(/\s+/g, '')
                .replace(/[^A-Z]/g, '')
            )
          }
        />
        <Button type="submit" disabled={!form.isValid()}>
          {t('buttonLabel')}
        </Button>
      </Stack>
    </form>
  );
}
