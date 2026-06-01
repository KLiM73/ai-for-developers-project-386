import { Badge, Button, Card, Group, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import type { PublicEventType } from '../../types/api';

interface EventTypeCardProps {
  eventType: PublicEventType;
}

export function EventTypeCard({ eventType }: EventTypeCardProps) {
  const navigate = useNavigate();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Title order={3} size="h4">{eventType.name}</Title>
        <Badge color="blue" variant="light">
          {eventType.durationMinutes} min
        </Badge>
      </Group>
      <Text size="sm" c="dimmed" mb="md" lineClamp={3}>
        {eventType.description}
      </Text>
      <Button
        fullWidth
        onClick={() => navigate(`/book/${eventType.id}`)}
      >
        Book
      </Button>
    </Card>
  );
}
