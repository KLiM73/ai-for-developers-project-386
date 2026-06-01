import type { ListResponse, TimeSlot } from '../types/api';
import { apiFetch } from './client';

export function getSlots(eventTypeId: string, granularity?: number): Promise<ListResponse<TimeSlot>> {
  const qs = granularity != null ? `?granularity=${granularity}` : '';
  return apiFetch(`/event-types/${eventTypeId}/slots${qs}`);
}
