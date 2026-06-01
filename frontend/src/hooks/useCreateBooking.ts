import { useMutation } from '@tanstack/react-query';
import { createBooking } from '../api/bookings';

export function useCreateBooking() {
  return useMutation({ mutationFn: createBooking });
}
