import type { Booking, CreateEventTypeRequest, EventType, ListResponse } from '../types/api';
import { apiFetch } from './client';

export function adminListEventTypes(): Promise<ListResponse<EventType>> {
  return apiFetch('/admin/event-types');
}

export function adminCreateEventType(body: CreateEventTypeRequest): Promise<EventType> {
  return apiFetch('/admin/event-types', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function adminListBookings(from?: string): Promise<ListResponse<Booking>> {
  const qs = from ? `?from=${encodeURIComponent(from)}` : '';
  return apiFetch(`/admin/bookings${qs}`);
}
