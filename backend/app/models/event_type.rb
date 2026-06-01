class EventType < ApplicationRecord
  self.primary_key = "id"

  has_many :bookings, foreign_key: :event_type_id, dependent: :destroy

  SLUG_PATTERN = /\A[a-z0-9][a-z0-9\-]*[a-z0-9]\z/

  validates :id, presence: true, uniqueness: true, length: { minimum: 2 },
                 format: { with: SLUG_PATTERN, message: "must be a lowercase slug" }
  validates :name, presence: true
  validates :duration_minutes, presence: true,
                               numericality: { only_integer: true, greater_than_or_equal_to: 1 }
end
