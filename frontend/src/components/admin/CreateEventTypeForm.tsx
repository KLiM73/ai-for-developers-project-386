import { Button, NumberInput, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useCreateEventType } from '../../hooks/useCreateEventType';
import type { CreateEventTypeRequest } from '../../types/api';

interface CreateEventTypeFormProps {
  onSuccess: () => void;
}

export function CreateEventTypeForm({ onSuccess }: CreateEventTypeFormProps) {
  const mutation = useCreateEventType();

  const form = useForm<CreateEventTypeRequest>({
    initialValues: { id: '', name: '', description: '', durationMinutes: 30 },
    validate: {
      id: (v) =>
        /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(v)
          ? null
          : 'Lowercase slug required (e.g. one-on-one-30min)',
      name: (v) => v.trim().length < 2 ? 'Name required' : null,
      description: (v) => v.trim().length < 5 ? 'Description required' : null,
      durationMinutes: (v) => v < 1 ? 'Must be at least 1 minute' : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await mutation.mutateAsync(values);
      notifications.show({ color: 'green', title: 'Created', message: `Event type "${values.name}" created.` });
      form.reset();
      onSuccess();
    } catch {
      notifications.show({ color: 'red', title: 'Error', message: 'Failed to create event type.' });
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <TextInput
          label="Slug ID"
          placeholder="one-on-one-30min"
          description="Lowercase letters, numbers, and hyphens only"
          {...form.getInputProps('id')}
        />
        <TextInput
          label="Name"
          placeholder="1:1 Meeting"
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Description"
          placeholder="Describe what this event type is for"
          rows={3}
          {...form.getInputProps('description')}
        />
        <NumberInput
          label="Duration (minutes)"
          min={1}
          step={5}
          {...form.getInputProps('durationMinutes')}
        />
        <Button type="submit" loading={mutation.isPending}>
          Create event type
        </Button>
      </Stack>
    </form>
  );
}
