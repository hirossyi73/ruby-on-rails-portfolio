import type {
  TodosResponse,
  TodoFilters,
  CreateTodoRequest,
  UpdateTodoRequest,
  Todo,
} from '~/types'

export const useTodos = () => {
  const api = useApi()

  // TODO一覧を取得（ページネーション対応）
  const fetchTodos = async (
    filters: TodoFilters = {}
  ): Promise<TodosResponse> => {
    return await api.get('/api/v1/todos', filters)
  }

  // 単一TODOを取得
  const fetchTodo = async (id: number): Promise<Todo> => {
    return await api.get(`/api/v1/todos/${id}`)
  }

  // TODOを作成
  const createTodo = async (data: CreateTodoRequest): Promise<Todo> => {
    return await api.post('/api/v1/todos', data)
  }

  // TODOを更新
  const updateTodo = async (
    id: number,
    data: UpdateTodoRequest
  ): Promise<Todo> => {
    return await api.put(`/api/v1/todos/${id}`, data)
  }

  // TODOを削除
  const deleteTodo = async (id: number): Promise<void> => {
    return await api.delete(`/api/v1/todos/${id}`)
  }

  // TODOの完了状態を切り替え
  const toggleTodoCompletion = async (
    id: number,
    completed: boolean
  ): Promise<Todo> => {
    return await updateTodo(id, { completed })
  }

  return {
    fetchTodos,
    fetchTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompletion,
  }
}
