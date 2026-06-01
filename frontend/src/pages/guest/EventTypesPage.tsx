import { Container, SimpleGrid, Skeleton, Stack, Title } from '@mantine/core';
import { EventTypeCard } from '../../components/guest/EventTypeCard';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { useEventTypes } from '../../hooks/useEventTypes';

export function EventTypesPage() {
  const { data, isLoading, isError, error } = useEventTypes();

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">Book a Meeting</Title>
      {isError && <ErrorAlert error={error} />}
      {isLoading && (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={180} radius="md" />
          ))}
        </SimpleGrid>
      )}
      {data && (
        <Stack>
          {data.items.length === 0 ? (
            <Title order={3} c="dimmed">No event types available.</Title>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {data.items.map((et) => (
                <EventTypeCard key={et.id} eventType={et} />
              ))}
            </SimpleGrid>
          )}
        </Stack>
      )}
    </Container>
  );
}
