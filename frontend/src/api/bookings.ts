import type { Booking, CreateBookingRequest } from '../types/api';
import { apiFetch } from './client';

export function createBooking(body: CreateBookingRequest): Promise<Booking> {
  return apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
