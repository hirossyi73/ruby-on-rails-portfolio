class AddDescriptionToTodos < ActiveRecord::Migration[8.0]
  def change
    add_column :todos, :description, :string, limit: 500, null: true
  end
end
