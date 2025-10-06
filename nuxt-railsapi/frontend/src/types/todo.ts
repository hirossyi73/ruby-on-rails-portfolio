// TODO関連の型定義

export interface Todo {
  id: number
  title: string
  //description?: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface Pagination {
  current_page: number
  per_page: number
  total_count: number
  total_pages: number
  has_next_page: boolean
  has_prev_page: boolean
}

export interface TodosResponse {
  todos: Todo[]
  pagination: Pagination
}

// ページネーション用のクエリパラメータ
export interface PaginationParams {
  page?: number
  per_page?: number
}

// TODO作成・更新用の型
export interface CreateTodoRequest {
  title: string
  //description?: string
  completed?: boolean
}

export interface UpdateTodoRequest {
  title?: string
  //description?: string
  completed?: boolean
}

// TODO一覧取得用のフィルター
export interface TodoFilters extends PaginationParams {
  completed?: boolean
  search?: string
  sort_by?: 'created_at' | 'updated_at' | 'title'
  sort_order?: 'asc' | 'desc'
}
