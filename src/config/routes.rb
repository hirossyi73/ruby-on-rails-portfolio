Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # ログイン関連のみ
  get '/login', to: 'login#index'
  post '/login', to: 'login#login'
  delete '/logout', to: 'login#logout'
  get '/logout', to: 'login#logout' # GETでもログアウト可能にする場合

  # Defines the root path route ("/")
  # root "posts#index"
  # Add a simple Todos resource with all standard RESTful routes
  resources :todos

  # 未認証時のリダイレクト先
  get '*path', to: redirect('/login'), constraints: lambda { |req|
    !req.session[:user_id] && req.path != '/login'
  }

  # ルートのページ
  root "todos#index"
end
