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
