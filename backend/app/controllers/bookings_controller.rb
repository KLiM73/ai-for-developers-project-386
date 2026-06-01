class BookingsController < ApplicationController
  def create
    event_type = EventType.find(params[:eventTypeId])

    start_time = begin
      Time.iso8601(params[:startTime])
    rescue ArgumentError, TypeError
      nil
    end

    unless start_time
      return render json: { code: "invalid_params", message: "startTime must be RFC 3339" },
                    status: :unprocessable_entity
    end

    end_time = start_time + event_type.duration_minutes.minutes

    if Booking.overlapping(start_time, end_time).exists?
      return render json: { code: "slot_unavailable",
                            message: "The requested time slot is not available" },
                    status: :unprocessable_entity
    end

    booking = Booking.new(
      event_type_id:   event_type.id,
      event_type_name: event_type.name,
      guest_name:      params[:guestName],
      guest_email:     params[:guestEmail],
      start_time:      start_time,
      end_time:        end_time
    )

    if booking.save
      render json: serialize_booking(booking), status: :created
    else
      render json: { code: "validation_error",
                     message: booking.errors.full_messages.join(", ") },
             status: :unprocessable_entity
    end
  end
end
