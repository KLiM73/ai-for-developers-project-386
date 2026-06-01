Booking.delete_all
EventType.delete_all

EventType.create!([
  { id: "intro-call-15min", name: "Intro Call",
    description: "15-minute introduction call.", duration_minutes: 15 },
  { id: "one-on-one-30min", name: "One-on-One",
    description: "30-minute focused session.", duration_minutes: 30 },
  { id: "deep-dive-60min", name: "Deep Dive",
    description: "Full hour exploration.", duration_minutes: 60 }
])

tomorrow = Time.now.utc.beginning_of_day + 1.day

Booking.create!([
  { event_type_id: "one-on-one-30min", event_type_name: "One-on-One",
    guest_name: "Alice Smith", guest_email: "alice@example.com",
    start_time: tomorrow + 10.hours, end_time: tomorrow + 10.hours + 30.minutes },
  { event_type_id: "deep-dive-60min", event_type_name: "Deep Dive",
    guest_name: "Bob Jones", guest_email: "bob@example.com",
    start_time: tomorrow + 14.hours, end_time: tomorrow + 15.hours }
])

puts "Seeded #{EventType.count} event types, #{Booking.count} bookings."
