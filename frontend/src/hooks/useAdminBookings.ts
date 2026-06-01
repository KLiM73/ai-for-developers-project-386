import { useQuery } from '@tanstack/react-query';
import { adminListBookings } from '../api/admin';

export function useAdminBookings(from?: string) {
  return useQuery({
    queryKey: ['admin', 'bookings', from],
    queryFn: () => adminListBookings(from),
  });
}
