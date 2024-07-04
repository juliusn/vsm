import { Container, Stack } from '@mantine/core';
import { SettingsNavigation } from './SettingsNavigation';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container size="24rem">
      <Stack>
        <SettingsNavigation />
        {children}
      </Stack>
    </Container>
  );
}
