class CreateBookings < ActiveRecord::Migration[8.1]
  def change
    create_table :bookings, id: false do |t|
      t.string :id, null: false, primary_key: true
      t.string :event_type_id, null: false
      t.string :event_type_name, null: false
      t.string :guest_name, null: false
      t.string :guest_email, null: false
      t.datetime :start_time, null: false
      t.datetime :end_time, null: false
      t.timestamps
    end
    add_index :bookings, :event_type_id
    add_index :bookings, :start_time
    add_foreign_key :bookings, :event_types
  end
end
