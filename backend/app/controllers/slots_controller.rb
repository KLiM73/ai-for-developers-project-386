class SlotsController < ApplicationController
  def index
    event_type = EventType.find(params[:id])
    granularity = (params[:granularity] || 30).to_i

    if granularity < 5
      return render json: { code: "invalid_params", message: "granularity must be >= 5" },
                    status: :unprocessable_entity
    end

    slots = SlotGeneratorService.new(event_type, granularity).call
    render json: { items: slots.map { { startTime: _1[:start_time].utc.iso8601,
                                        endTime:   _1[:end_time].utc.iso8601 } } }
  end
end
