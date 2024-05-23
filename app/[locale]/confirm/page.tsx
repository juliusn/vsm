import { Container } from '@mantine/core';
import { Confirm } from './Confirm';

export default async function page() {
  return (
    <Container size="24rem">
      <Confirm />
    </Container>
  );
}
