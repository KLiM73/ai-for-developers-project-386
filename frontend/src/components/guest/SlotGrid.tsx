import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { useMemo } from 'react';
import type { TimeSlot } from '../../types/api';

interface SlotGridProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
}

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDate(ts: string): string {
  return new Date(ts).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export function SlotGrid({ slots, selectedSlot, onSelect }: SlotGridProps) {
  const grouped = useMemo(() => {
    return slots.reduce<Record<string, TimeSlot[]>>((acc, slot) => {
      const key = formatDate(slot.startTime);
      (acc[key] ??= []).push(slot);
      return acc;
    }, {});
  }, [slots]);

  if (slots.length === 0) {
    return (
      <Alert color="yellow" title="No availability">
        No available slots for the next 14 days.
      </Alert>
    );
  }

  return (
    <Stack gap="lg">
      {Object.entries(grouped).map(([date, daySlots]) => (
        <Stack key={date} gap="xs">
          <Text fw={700} size="sm">{date}</Text>
          <Group gap="xs">
            {daySlots.map((slot) => {
              const isSelected = selectedSlot?.startTime === slot.startTime;
              return (
                <Button
                  key={slot.startTime}
                  variant={isSelected ? 'filled' : 'outline'}
                  size="xs"
                  onClick={() => onSelect(slot)}
                >
                  {formatTime(slot.startTime)}
                </Button>
              );
            })}
          </Group>
        </Stack>
      ))}
    </Stack>
  );
}
