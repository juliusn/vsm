import { Group, Modal, Text } from '@mantine/core';
import { IconCheck } from '@tabler/icons-react';

export default function SuccessModal({
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
        <Group c="green">
          <IconCheck />
          <Text fw={700}>{title}</Text>
        </Group>
      }>
      {children}
    </Modal>
  );
}
