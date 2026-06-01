import { useQuery } from '@tanstack/react-query';
import { adminListEventTypes } from '../api/admin';

export function useAdminEventTypes() {
  return useQuery({
    queryKey: ['admin', 'eventTypes'],
    queryFn: adminListEventTypes,
  });
}
