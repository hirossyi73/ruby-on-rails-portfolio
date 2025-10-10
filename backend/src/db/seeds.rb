# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create OAuth2 Application for Vue.js frontend
oauth_app = Doorkeeper::Application.find_or_create_by!(name: "Vue.js Frontend") do |app|
  app.redirect_uri = "#{ENV['WEB_URL'] || 'http://localhost:80'}/callback"
  app.scopes = "read write"
  app.confidential = false # Public client for SPA
end

puts "OAuth2 Application created:"
puts "Client ID: #{oauth_app.uid}"
puts "Client Secret: #{oauth_app.secret}"
puts "Redirect URI: #{oauth_app.redirect_uri}"

# Create some sample todos for development
todos = [
  { 
    title: "開発環境のセットアップ", 
    description: "Docker、Rails、Vue.jsの開発環境を構築する",
    completed: true 
  },
  { 
    title: "Rails チュートリアルを読む", 
    description: "Rails Guidesを一通り読んでMVCアーキテクチャを理解する",
    completed: false 
  },
  { 
    title: "Todo 一覧ページを作る", 
    description: "Element PlusとTailwind CSSを使って美しいTodo一覧ページを実装する",
    completed: false 
  },
  {
    title: "API仕様書を作成",
    description: "フロントエンドとバックエンドのAPI連携のための仕様書を作成する",
    completed: false
  },
  {
    title: "テストケースの追加",
    description: "RSpecを使ってTodoモデルとAPIエンドポイントのテストを作成する",
    completed: false
  }
]

todos.each do |attrs|
  Todo.find_or_create_by!(title: attrs[:title]) do |t|
    t.description = attrs[:description]
    t.completed = attrs[:completed]
  end
end


# Create test users
User.find_or_create_by!(email: 'admin@example.com') do |user|
  user.name = '管理者'
  user.password = 'password123'
  user.password_confirmation = 'password123'
end

User.find_or_create_by!(email: 'user@example.com') do |user|
  user.name = '一般ユーザー'
  user.password = 'password123'
  user.password_confirmation = 'password123'
end

puts "テストユーザーを作成しました"
puts "Email: admin@example.com, Password: password123"
puts "Email: user@example.com, Password: password123"
