import type { ListResponse, PublicEventType } from '../types/api';
import { apiFetch } from './client';

export function getPublicEventTypes(): Promise<ListResponse<PublicEventType>> {
  return apiFetch('/event-types');
}
