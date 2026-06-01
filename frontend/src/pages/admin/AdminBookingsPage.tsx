import { Group, Loader, Stack, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useState } from 'react';
import { BookingTable } from '../../components/admin/BookingTable';
import { ErrorAlert } from '../../components/shared/ErrorAlert';
import { useAdminBookings } from '../../hooks/useAdminBookings';

export function AdminBookingsPage() {
  const [fromDate, setFromDate] = useState<string | null>(new Date().toISOString().slice(0, 10));

  const { data, isLoading, isError, error } = useAdminBookings(fromDate ?? undefined);

  return (
    <Stack>
      <Group justify="space-between" align="flex-end">
        <Title order={2}>Upcoming Bookings</Title>
        <DatePickerInput
          label="From date"
          placeholder="Filter from date"
          value={fromDate}
          onChange={(v) => setFromDate(v)}
          clearable
          w={200}
        />
      </Group>

      {isError && <ErrorAlert error={error} />}
      {isLoading && <Loader />}
      {data && <BookingTable bookings={data.items} />}
    </Stack>
  );
}
