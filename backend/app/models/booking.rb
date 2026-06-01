class Booking < ApplicationRecord
  self.primary_key = "id"

  belongs_to :event_type, foreign_key: :event_type_id

  EMAIL_PATTERN = /\A[^@\s]+@[^@\s]+\.[^@\s]+\z/

  before_create { self.id = SecureRandom.uuid }

  validates :guest_name, presence: true
  validates :guest_email, presence: true, format: { with: EMAIL_PATTERN }
  validates :start_time, :end_time, presence: true

  scope :overlapping, ->(start_t, end_t) {
    where("start_time < ? AND end_time > ?", end_t, start_t)
  }
end
