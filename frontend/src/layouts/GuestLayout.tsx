import { Anchor, AppShell, Group, Text } from '@mantine/core';
import { Link, Outlet } from 'react-router-dom';

export function GuestLayout() {
  return (
    <AppShell header={{ height: 56 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Anchor component={Link} to="/" underline="never">
            <Text fw={700} size="lg">Calendar Booking</Text>
          </Anchor>
          <Anchor component={Link} to="/admin/event-types" size="sm">
            Admin
          </Anchor>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
