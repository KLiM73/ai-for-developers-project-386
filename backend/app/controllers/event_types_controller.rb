class EventTypesController < ApplicationController
  def index
    render json: { items: EventType.all.order(:id).map { serialize_event_type(_1) } }
  end
end
