Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # OAuth2 endpoints with api prefix
  scope path: '/api' do
    use_doorkeeper
  end

  # API endpoints (protected by OAuth2)
  namespace :api do
    # 認証エンドポイント（グローバルコントローラーを明示的に指定）
    get 'auth/me', controller: '/auth', action: 'me'
    post 'auth/revoke', controller: '/auth', action: 'revoke'

    namespace :v1 do
      resources :todos
      resources :users, only: [:show, :update]
      
      # API認証エンドポイント
      post 'auth/login', to: 'sessions#create'
      post 'auth/register', to: 'sessions#register'
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
