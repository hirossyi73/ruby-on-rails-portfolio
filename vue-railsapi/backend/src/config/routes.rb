Rails.application.routes.draw do
  use_doorkeeper
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Authentication endpoints
  namespace :auth do
    get 'me', to: 'auth#me'
    post 'revoke', to: 'auth#revoke'
  end

  # API endpoints (protected by OAuth2)
  namespace :api do
    namespace :v1 do
      resources :todos
      resources :users, only: [:show, :update]
    end
  end

  # Custom health check endpoint
  get "health" => "health#check"

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  #get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
