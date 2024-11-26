import { Group, Title } from '@mantine/core';
import { PortAreaSwitch } from './PortAreaSwitch';

export default async function BerthsLayout({
  children,
  params: { locode, portAreaCode },
}: {
  children: React.ReactNode;
  params: { locode: string; portAreaCode: string };
}) {
  return (
    <>
      <Group>
        <Title size="h3">{portAreaCode}</Title>
        <PortAreaSwitch locode={locode} portAreaCode={portAreaCode} />
      </Group>
      {children}
    </>
  );
}
