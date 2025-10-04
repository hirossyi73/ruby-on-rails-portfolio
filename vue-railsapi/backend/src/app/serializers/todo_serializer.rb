class TodoSerializer
  def self.serialize(todo)
    {
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      created_at: todo.created_at,
      updated_at: todo.updated_at
    }
  end

  def self.serialize_collection(todos)
    todos.map { |todo| serialize(todo) }
  end
end