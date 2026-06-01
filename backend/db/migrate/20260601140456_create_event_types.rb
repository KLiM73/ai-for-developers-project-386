class CreateEventTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :event_types, id: false do |t|
      t.string :id, null: false, primary_key: true
      t.string :name, null: false
      t.string :description, null: false, default: ""
      t.integer :duration_minutes, null: false
      t.timestamps
    end
  end
end
