class SlotGeneratorService
  WINDOW_DAYS = 14

  def initialize(event_type, granularity)
    @duration    = event_type.duration_minutes
    @granularity = granularity
  end

  def call
    now          = Time.now.utc
    window_start = now.beginning_of_day
    window_end   = window_start + WINDOW_DAYS.days

    existing = Booking
      .where("start_time < ? AND end_time > ?", window_end, window_start)
      .pluck(:start_time, :end_time)
      .map { |s, e| [ s.utc, e.utc ] }

    slots  = []
    cursor = window_start

    while cursor < window_end
      slot_start = cursor
      slot_end   = cursor + @duration.minutes

      if slot_start >= now && slot_end <= window_end && !overlaps_any?(slot_start, slot_end, existing)
        slots << { start_time: slot_start, end_time: slot_end }
      end

      cursor += @granularity.minutes
    end

    slots
  end

  private

  def overlaps_any?(s, e, existing)
    existing.any? { |bs, be| s < be && e > bs }
  end
end
