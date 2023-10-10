'use client';

import { Modal, Stack, Text } from '@mantine/core';
import { IconCheck, IconExclamationCircle, IconX } from '@tabler/icons-react';
import { usePathname, useRouter } from 'next-intl/client';
import { useSearchParams } from 'next/navigation';

export function Modals({
  titleMessage,
  titleError,
}: {
  titleMessage: string;
  titleError: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const message = searchParams.get('message');
  const error = searchParams.get('error');
  return (
    <>
      <Modal
        opened={message !== null}
        onClose={() => deleteParam('message')}
        centered
        styles={{
          title: {
            color: 'var(--mantine-color-green-outline)',
          },
        }}
        title={
          <div className="flex gap-4">
            <IconCheck stroke={1.5} />
            <Text>{titleMessage}</Text>
          </div>
        }>
        {message}
      </Modal>
      <Modal
        opened={error !== null}
        onClose={() => deleteParam('error')}
        centered
        styles={{
          title: { color: 'var(--mantine-color-red-outline)' },
        }}
        title={
          <div className="flex gap-4">
            <IconExclamationCircle stroke={1.5} />
            <Text>{titleError}</Text>
          </div>
        }>
        <Stack>{error}</Stack>
      </Modal>
    </>
  );

  function deleteParam(param: string) {
    const params = new URLSearchParams(searchParams);
    params.delete(param);
    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl);
  }
}
