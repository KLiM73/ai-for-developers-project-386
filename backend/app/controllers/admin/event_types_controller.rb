module Admin
  class EventTypesController < ApplicationController
    def index
      render json: { items: EventType.all.order(:id).map { serialize_event_type(_1) } }
    end

    def create
      et = EventType.new(
        id:               params[:id],
        name:             params[:name],
        description:      params[:description].to_s,
        duration_minutes: params[:durationMinutes]
      )

      if et.save
        render json: serialize_event_type(et), status: :created
      else
        render json: { code: "validation_error",
                       message: et.errors.full_messages.join(", ") },
               status: :unprocessable_entity
      end
    end
  end
end
