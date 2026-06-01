module Admin
  class BookingsController < ApplicationController
    def index
      from = begin
        Time.iso8601(params[:from])
      rescue ArgumentError, TypeError
        nil
      end
      from ||= Time.now.utc

      bookings = Booking.where("start_time >= ?", from).order(:start_time)
      render json: { items: bookings.map { serialize_booking(_1) } }
    end
  end
end
