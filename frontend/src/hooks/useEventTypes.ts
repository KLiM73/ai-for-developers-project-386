import { useQuery } from '@tanstack/react-query';
import { getPublicEventTypes } from '../api/eventTypes';

export function useEventTypes() {
  return useQuery({
    queryKey: ['eventTypes'],
    queryFn: getPublicEventTypes,
  });
}
