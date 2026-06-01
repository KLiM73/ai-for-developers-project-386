import { useQuery } from '@tanstack/react-query';
import { getSlots } from '../api/slots';

export function useSlots(eventTypeId: string, granularity?: number) {
  return useQuery({
    queryKey: ['slots', eventTypeId, granularity],
    queryFn: () => getSlots(eventTypeId, granularity),
    enabled: Boolean(eventTypeId),
  });
}
