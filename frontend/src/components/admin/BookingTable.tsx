import { Badge, Table, Text } from '@mantine/core';
import type { Booking } from '../../types/api';

interface BookingTableProps {
  bookings: Booking[];
}

function formatDateTime(ts: string): string {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function BookingTable({ bookings }: BookingTableProps) {
  if (bookings.length === 0) {
    return <Text c="dimmed">No upcoming bookings.</Text>;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Event type</Table.Th>
          <Table.Th>Guest</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Start</Table.Th>
          <Table.Th>End</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {bookings.map((booking) => (
          <Table.Tr key={booking.id}>
            <Table.Td>
              <Badge variant="light">{booking.eventTypeName}</Badge>
            </Table.Td>
            <Table.Td>{booking.guestName}</Table.Td>
            <Table.Td>{booking.guestEmail}</Table.Td>
            <Table.Td>{formatDateTime(booking.startTime)}</Table.Td>
            <Table.Td>{formatDateTime(booking.endTime)}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
