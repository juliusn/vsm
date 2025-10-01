import { Stack } from '@mantine/core';
import { EditServiceModalProvider } from '../../context/EditServiceModalContext';
import { DeleteServiceModalProvider } from './DeleteServiceModalContext';

export default function DataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EditServiceModalProvider>
      <DeleteServiceModalProvider>
        <Stack h="100%">{children}</Stack>
      </DeleteServiceModalProvider>
    </EditServiceModalProvider>
  );
}
