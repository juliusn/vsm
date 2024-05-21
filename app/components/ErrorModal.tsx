import { Group, Modal, Text } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

export function ErrorModal({
  opened,
  onClose,
  title,
  children,
}: {
  opened: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group c="red">
          <IconExclamationCircle />
          <Text fw={700}>{title}</Text>
        </Group>
      }>
      {children}
    </Modal>
  );
}
