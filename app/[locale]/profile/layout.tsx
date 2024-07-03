import { Container } from '@mantine/core';

export default function layout({ children }: { children: React.ReactNode }) {
  return <Container size="24rem">{children}</Container>;
}
