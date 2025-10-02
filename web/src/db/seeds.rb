# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create some sample todos for development
todos = [
  { title: "開発環境のセットアップ", completed: true },
  { title: "Rails チュートリアルを読む", completed: false },
  { title: "Todo 一覧ページを作る", completed: false }
]

todos.each do |attrs|
  Todo.find_or_create_by!(title: attrs[:title]) do |t|
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
