import { Badge, Breadcrumbs, Container, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookingForm } from '../../components/guest/BookingForm';
import { SlotGrid } from '../../components/guest/SlotGrid';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { useEventTypes } from '../../hooks/useEventTypes';
import { useSlots } from '../../hooks/useSlots';
import type { TimeSlot } from '../../types/api';

export function BookingPage() {
  const { eventTypeId } = useParams<{ eventTypeId: string }>();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const eventTypesQuery = useEventTypes();
  const slotsQuery = useSlots(eventTypeId!);

  const eventType = eventTypesQuery.data?.items.find((et) => et.id === eventTypeId);

  return (
    <Container size="md" py="xl">
      <Breadcrumbs mb="xl">
        <Link to="/">Home</Link>
        <Text>{eventType?.name ?? eventTypeId}</Text>
      </Breadcrumbs>

      {eventType && (
        <Stack mb="xl">
          <Group align="center">
            <Title order={2}>{eventType.name}</Title>
            <Badge variant="light">{eventType.durationMinutes} min</Badge>
          </Group>
          <Text c="dimmed">{eventType.description}</Text>
        </Stack>
      )}

      {slotsQuery.isError && <ErrorAlert error={slotsQuery.error} />}
      {slotsQuery.isLoading && <Loader />}

      {slotsQuery.data && !selectedSlot && (
        <Stack>
          <Title order={3}>Pick a time</Title>
          <SlotGrid
            slots={slotsQuery.data.items}
            selectedSlot={selectedSlot}
            onSelect={setSelectedSlot}
          />
        </Stack>
      )}

      {selectedSlot && (
        <Stack>
          <Title order={3}>Your details</Title>
          <BookingForm
            selectedSlot={selectedSlot}
            onBack={() => setSelectedSlot(null)}
          />
        </Stack>
      )}
    </Container>
  );
}
