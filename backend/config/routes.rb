Rails.application.routes.draw do
  get  "/event-types",          to: "event_types#index"
  get  "/event-types/:id/slots", to: "slots#index"
  post "/bookings",             to: "bookings#create"

  namespace :admin do
    resources :event_types, only: %i[index create], path: "event-types"
    get "/bookings", to: "bookings#index"
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
