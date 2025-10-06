// API共通の型定義

export interface ApiResponse<T = any> {
  data?: T
  message?: string
  errors?: string[]
}

export interface ApiError {
  message: string
  status?: number
  errors?: string[]
}

// リクエストの共通オプション
export interface RequestOptions {
  headers?: Record<string, string>
  params?: Record<string, any>
  timeout?: number
}

// ページネーション共通インターフェース
export interface BasePagination {
  current_page: number
  per_page: number
  total_count: number
  total_pages: number
  has_next_page: boolean
  has_prev_page: boolean
}

// ページネーション付きレスポンスの汎用型
export interface PaginatedResponse<T> {
  data: T[]
  pagination: BasePagination
}