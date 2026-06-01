import { Badge, Button, Card, Group, Loader, Modal, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { CreateEventTypeForm } from '../../components/admin/CreateEventTypeForm';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { useAdminEventTypes } from '../../hooks/useAdminEventTypes';

export function AdminEventTypesPage() {
  const { data, isLoading, isError, error } = useAdminEventTypes();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Stack>
      <Group justify="space-between">
        <Title order={2}>Event Types</Title>
        <Button onClick={open}>+ New event type</Button>
      </Group>

      <Modal opened={opened} onClose={close} title="Create event type">
        <CreateEventTypeForm onSuccess={close} />
      </Modal>

      {isError && <ErrorAlert error={error} />}
      {isLoading && <Loader />}

      {data && (
        <>
          {data.items.length === 0 ? (
            <Text c="dimmed">No event types yet. Create one to get started.</Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {data.items.map((et) => (
                <Card key={et.id} shadow="sm" padding="md" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Text fw={600}>{et.name}</Text>
                    <Badge variant="light">{et.durationMinutes} min</Badge>
                  </Group>
                  <Text size="sm" c="dimmed" mb="xs" lineClamp={2}>{et.description}</Text>
                  <Text size="xs" c="dimmed">ID: {et.id}</Text>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </>
      )}
    </Stack>
  );
}
