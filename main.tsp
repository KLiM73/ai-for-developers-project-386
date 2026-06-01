import "@typespec/http";
import "@typespec/openapi3";

using Http;

@service(#{ title: "Calendar Booking API" })
namespace CalendarBooking;

// ---------------------------------------------------------------------------
// Scalars
// ---------------------------------------------------------------------------

@doc("UTC datetime encoded as an RFC 3339 string")
@encode("rfc3339")
scalar Timestamp extends utcDateTime;

@doc("URL-safe lowercase slug identifier, e.g. \"one-on-one-30min\"")
@pattern("[a-z0-9][a-z0-9-]*[a-z0-9]")
scalar Slug extends string;

// ---------------------------------------------------------------------------
// Shared models
// ---------------------------------------------------------------------------

@doc("Standard error envelope returned on all failure responses")
@error
model ApiError {
  @doc("Machine-readable error code")
  code: string;

  @doc("Human-readable description of the error")
  message: string;
}

@doc("Generic list response wrapper")
model ListResponse<T> {
  @doc("Array of result items")
  items: T[];
}

// ---------------------------------------------------------------------------
// Domain models
// ---------------------------------------------------------------------------

@doc("A type of meeting that guests can book")
model EventType {
  @doc("URL-safe unique slug identifier")
  id: Slug;

  @doc("Human-readable display name")
  name: string;

  @doc("Full description of what this event type involves")
  description: string;

  @doc("Duration of the event in minutes")
  @minValue(1)
  durationMinutes: int32;
}

@doc("Public-facing event type shown to guests")
alias PublicEventType = EventType;

@doc("Request body for creating a new event type")
model CreateEventTypeRequest {
  @doc("Desired slug identifier — must be unique across all event types")
  id: Slug;

  @doc("Human-readable display name")
  name: string;

  @doc("Full description of what this event type involves")
  description: string;

  @doc("Duration of the event in minutes")
  @minValue(1)
  durationMinutes: int32;
}

@doc("A single available time slot for an event type")
model TimeSlot {
  @doc("Slot start time in UTC")
  startTime: Timestamp;

  @doc("Slot end time in UTC — equals startTime plus the event type duration")
  endTime: Timestamp;
}

@doc("A confirmed booking made by a guest")
model Booking {
  @doc("Unique system-generated booking identifier")
  id: string;

  @doc("Slug of the booked event type")
  eventTypeId: Slug;

  @doc("Display name of the booked event type at the time of booking")
  eventTypeName: string;

  @doc("Full name of the guest who made the booking")
  guestName: string;

  @doc("Email address of the guest who made the booking")
  @format("email")
  guestEmail: string;

  @doc("Booking start time in UTC")
  startTime: Timestamp;

  @doc("Booking end time in UTC — equals startTime plus the event type duration")
  endTime: Timestamp;
}

@doc("Request body for creating a new booking")
model CreateBookingRequest {
  @doc("Slug of the event type to book")
  eventTypeId: Slug;

  @doc("The chosen available start time; must correspond to a free slot in the 14-day window")
  startTime: Timestamp;

  @doc("Full name of the guest")
  guestName: string;

  @doc("Email address of the guest")
  @format("email")
  guestEmail: string;
}

// ---------------------------------------------------------------------------
// Admin namespace — /admin/* (no authentication required by project design)
// ---------------------------------------------------------------------------

@route("/admin")
@tag("Admin")
namespace CalendarBooking.Admin {
  @doc("Admin operations on event types")
  @route("/event-types")
  interface EventTypes {
    @doc("Create a new event type")
    @post
    create(@body body: CreateEventTypeRequest): CreatedResponse & EventType | ApiError;

    @doc("List all event types with full details")
    @get
    list(): ListResponse<EventType> | ApiError;
  }

  @doc("Admin operations on bookings")
  @route("/bookings")
  interface Bookings {
    @doc("List all upcoming bookings across all event types, sorted ascending by start time. Defaults to bookings starting from the current server time.")
    @get
    listUpcoming(
      @doc("Include only bookings starting at or after this time. Defaults to now when omitted.")
      @query from?: Timestamp
    ): ListResponse<Booking> | ApiError;
  }
}

// ---------------------------------------------------------------------------
// Guest namespace — event-type discovery and slot availability
// ---------------------------------------------------------------------------

@route("/event-types")
@tag("Guest")
namespace CalendarBooking.GuestEventTypes {
  @doc("Guest-accessible event type operations")
  interface EventTypes {
    @doc("List all publicly available event types")
    @get
    list(): ListResponse<PublicEventType> | ApiError;

    @doc("Get available time slots for an event type within the next 14 days from today. Slots are generated on a fixed-size grid; already-booked intervals are excluded. No two bookings may overlap regardless of event type.")
    @get
    @route("{eventTypeId}/slots")
    getSlots(
      @path
      @doc("Slug identifier of the event type")
      eventTypeId: Slug,

      @query
      @doc("Grid granularity in minutes for slot generation. Must be ≥ 5. Defaults to 30 when omitted.")
      @minValue(5)
      granularity?: int32
    ): ListResponse<TimeSlot> | ApiError;
  }
}

// ---------------------------------------------------------------------------
// Guest namespace — booking creation (separate from /event-types to avoid path conflict)
// ---------------------------------------------------------------------------

@route("/bookings")
@tag("Guest")
namespace CalendarBooking.GuestBookings {
  @doc("Guest booking creation")
  interface Bookings {
    @doc("Create a new booking. The chosen startTime must be an available slot from the 14-day window. No two bookings may overlap in time, even for different event types.")
    @post
    create(@body body: CreateBookingRequest): CreatedResponse & Booking | ApiError;
  }
}
