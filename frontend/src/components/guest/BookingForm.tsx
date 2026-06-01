import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateBooking } from '../../hooks/useCreateBooking';
import type { TimeSlot } from '../../types/api';

interface BookingFormProps {
  selectedSlot: TimeSlot;
  onBack: () => void;
}

function formatDateTime(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function BookingForm({ selectedSlot, onBack }: BookingFormProps) {
  const { eventTypeId } = useParams<{ eventTypeId: string }>();
  const navigate = useNavigate();
  const mutation = useCreateBooking();

  const form = useForm({
    initialValues: { guestName: '', guestEmail: '' },
    validate: {
      guestName: (v) => v.trim().length < 2 ? 'Name must be at least 2 characters' : null,
      guestEmail: (v) => /^\S+@\S+\.\S+$/.test(v) ? null : 'Enter a valid email address',
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      const booking = await mutation.mutateAsync({
        eventTypeId: eventTypeId!,
        startTime: selectedSlot.startTime,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
      });
      navigate(`/book/${eventTypeId}/success`, { state: booking });
    } catch {
      notifications.show({
        color: 'red',
        title: 'Booking failed',
        message: 'Could not create booking. Please try again.',
      });
    }
  });

  return (
    <Stack>
      <Text size="sm" c="dimmed">
        Selected time: <strong>{formatDateTime(selectedSlot.startTime)}</strong>
      </Text>
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Full name"
            placeholder="Jane Smith"
            {...form.getInputProps('guestName')}
          />
          <TextInput
            label="Email address"
            placeholder="jane@example.com"
            type="email"
            {...form.getInputProps('guestEmail')}
          />
          <Group>
            <Button variant="default" onClick={onBack}>
              ← Back
            </Button>
            <Button type="submit" loading={mutation.isPending}>
              Confirm booking
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
}
