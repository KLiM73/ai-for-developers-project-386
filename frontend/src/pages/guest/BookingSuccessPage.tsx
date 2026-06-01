import { Button, Card, Container, Stack, Text, Title } from '@mantine/core';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { Booking } from '../../types/api';

function formatDateTime(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function BookingSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state as Booking | null;

  useEffect(() => {
    if (!booking) navigate('/', { replace: true });
  }, [booking, navigate]);

  if (!booking) return null;

  return (
    <Container size="sm" py="xl">
      <Stack align="center">
        <Title order={2} c="green">Booking Confirmed!</Title>
        <Text c="dimmed">You'll receive a confirmation at {booking.guestEmail}</Text>
        <Card shadow="sm" padding="lg" radius="md" withBorder w="100%">
          <Stack gap="xs">
            <Text><strong>Event:</strong> {booking.eventTypeName}</Text>
            <Text><strong>Name:</strong> {booking.guestName}</Text>
            <Text><strong>Email:</strong> {booking.guestEmail}</Text>
            <Text><strong>Start:</strong> {formatDateTime(booking.startTime)}</Text>
            <Text><strong>End:</strong> {formatDateTime(booking.endTime)}</Text>
            <Text size="xs" c="dimmed">Booking ID: {booking.id}</Text>
          </Stack>
        </Card>
        <Button component={Link} to="/" variant="light">
          Book another meeting
        </Button>
      </Stack>
    </Container>
  );
}
