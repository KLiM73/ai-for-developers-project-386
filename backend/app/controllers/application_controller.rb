class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound do
    render json: { code: "not_found", message: "Resource not found" }, status: :not_found
  end

  rescue_from ActiveRecord::RecordNotUnique do
    render json: { code: "conflict", message: "An event type with that id already exists" },
           status: :conflict
  end

  private

  def serialize_event_type(et)
    { id: et.id, name: et.name, description: et.description,
      durationMinutes: et.duration_minutes }
  end

  def serialize_booking(b)
    { id: b.id, eventTypeId: b.event_type_id, eventTypeName: b.event_type_name,
      guestName: b.guest_name, guestEmail: b.guest_email,
      startTime: b.start_time.utc.iso8601, endTime: b.end_time.utc.iso8601 }
  end
end
