import { AppShell, Group, NavLink, Text } from '@mantine/core';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function AdminLayout() {
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 56 }}
      navbar={{ width: 200, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Text fw={700} size="lg">Admin Dashboard</Text>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="sm">
        <NavLink
          component={Link}
          to="/admin/event-types"
          label="Event Types"
          active={location.pathname === '/admin/event-types'}
        />
        <NavLink
          component={Link}
          to="/admin/bookings"
          label="Bookings"
          active={location.pathname === '/admin/bookings'}
        />
        <NavLink
          component={Link}
          to="/"
          label="← Guest View"
          mt="auto"
        />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
