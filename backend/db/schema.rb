# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_01_140457) do
  create_table "bookings", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "end_time", null: false
    t.string "event_type_id", null: false
    t.string "event_type_name", null: false
    t.string "guest_email", null: false
    t.string "guest_name", null: false
    t.datetime "start_time", null: false
    t.datetime "updated_at", null: false
    t.index ["event_type_id"], name: "index_bookings_on_event_type_id"
    t.index ["start_time"], name: "index_bookings_on_start_time"
  end

  create_table "event_types", id: :string, force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "description", default: "", null: false
    t.integer "duration_minutes", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "bookings", "event_types"
end
