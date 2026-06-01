export type Slug = string;
export type Timestamp = string;

export interface ApiError {
  code: string;
  message: string;
}

export interface ListResponse<T> {
  items: T[];
}

export interface EventType {
  id: Slug;
  name: string;
  description: string;
  durationMinutes: number;
}

export type PublicEventType = EventType;

export interface TimeSlot {
  startTime: Timestamp;
  endTime: Timestamp;
}

export interface Booking {
  id: string;
  eventTypeId: Slug;
  eventTypeName: string;
  guestName: string;
  guestEmail: string;
  startTime: Timestamp;
  endTime: Timestamp;
}

export interface CreateEventTypeRequest {
  id: Slug;
  name: string;
  description: string;
  durationMinutes: number;
}

export interface CreateBookingRequest {
  eventTypeId: Slug;
  startTime: Timestamp;
  guestName: string;
  guestEmail: string;
}

export function isApiError(r: unknown): r is ApiError {
  return typeof r === 'object' && r !== null && 'code' in r && 'message' in r;
}
