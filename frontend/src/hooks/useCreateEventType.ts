import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCreateEventType } from '../api/admin';

export function useCreateEventType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminCreateEventType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'eventTypes'] });
    },
  });
}
