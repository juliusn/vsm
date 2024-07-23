import { Container, ScrollAreaAutosize, Stack } from '@mantine/core';
import { DataNavigation } from './DataNavigation';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <Stack>
        <DataNavigation />
        <ScrollAreaAutosize type="auto" mah="auto">
          {children}
        </ScrollAreaAutosize>
      </Stack>
    </Container>
  );
}
