<template>
  <div class="todo-container">
    <h1>TODO一覧</h1>
    
    <div v-if="pending" class="loading">
      読み込み中...
    </div>
    
    <div v-else-if="error" class="error">
      エラーが発生しました: {{ error }}
    </div>
    
    <div v-else>
      <div v-if="todos.length === 0" class="no-todos">
        TODOがありません
      </div>
      
      <div v-else class="todo-list">
        <div 
          v-for="todo in todos" 
          :key="todo.id" 
          class="todo-item"
          :class="{ completed: todo.completed }"
        >
          <div class="todo-content">
            <h3 class="todo-title">{{ todo.title }}</h3>
            <!-- <p v-if="todo.description" class="todo-description">
              {{ todo.description }}
            </p> -->
            <div class="todo-meta">
              <span class="todo-status" :class="todo.completed ? 'status-completed' : 'status-pending'">
                {{ todo.completed ? '完了' : '未完了' }}
              </span>
              <span class="todo-id">ID: {{ todo.id }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="todo-stats">
        <p>総数: {{ totalCount }}件</p>
        <p>現在のページ: {{ todos.length }}件</p>
        <p>完了: {{ completedCount }}件</p>
        <p>未完了: {{ pendingCount }}件</p>
        <p v-if="pagination">
          ページ {{ pagination.current_page }} / {{ pagination.total_pages }}
        </p>
      </div>
      
      <!-- ページネーション -->
      <div v-if="pagination && pagination.total_pages > 1" class="pagination">
        <button 
          @click="goToPrevPage" 
          :disabled="!pagination.has_prev_page"
          class="pagination-btn"
        >
          ← 前のページ
        </button>
        
        <span class="pagination-info">
          {{ pagination.current_page }} / {{ pagination.total_pages }}
        </span>
        
        <button 
          @click="goToNextPage" 
          :disabled="!pagination.has_next_page"
          class="pagination-btn"
        >
          次のページ →
        </button>
      </div>
    </div>
    
    <div class="actions">
      <button @click="refreshTodos" class="refresh-btn">
        再読み込み
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo, TodosResponse, Pagination, TodoFilters } from '~/types'

// リアクティブデータ
const todos = ref<Todo[]>([])
const pagination = ref<Pagination | null>(null)
const pending = ref(false)
const error = ref<string | null>(null)

// フィルター設定
const filters = ref<TodoFilters>({
  page: 1,
  per_page: 20
})

// TODOコンポーザブルを取得
const todoComposable = useTodos()

// TODOを取得する関数
const fetchTodos = async () => {
  pending.value = true
  error.value = null
  
  try {
    const response: TodosResponse = await todoComposable.fetchTodos(filters.value)
    todos.value = response.todos
    pagination.value = response.pagination
  } catch (err) {
    console.error('TODOの取得に失敗しました:', err)
    error.value = 'TODOの取得に失敗しました'
  } finally {
    pending.value = false
  }
}

// 再読み込み関数
const refreshTodos = () => {
  fetchTodos()
}

// ページ変更
const changePage = (page: number) => {
  filters.value.page = page
  fetchTodos()
}

// 次のページ
const goToNextPage = () => {
  if (pagination.value?.has_next_page) {
    changePage(filters.value.page! + 1)
  }
}

// 前のページ
const goToPrevPage = () => {
  if (pagination.value?.has_prev_page) {
    changePage(filters.value.page! - 1)
  }
}

// 計算プロパティ
const completedCount = computed(() => 
  todos.value.filter(todo => todo.completed).length
)

const pendingCount = computed(() => 
  todos.value.filter(todo => !todo.completed).length
)

// 総数（ページネーション情報から取得）
const totalCount = computed(() => 
  pagination.value?.total_count || todos.value.length
)

// ページ読み込み時にTODOを取得
onMounted(() => {
  fetchTodos()
})
</script>

<style scoped>
.todo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #333;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.loading {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  padding: 2rem;
}

.error {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.no-todos {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.todo-list {
  margin-bottom: 2rem;
}

.todo-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.todo-item.completed {
  opacity: 0.7;
  background-color: #f8f9fa;
}

.todo-title {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: #666;
}

.todo-description {
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.todo-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.todo-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: bold;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.todo-id {
  color: #999;
}

.todo-stats {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.todo-stats p {
  margin: 0.25rem 0;
  color: #666;
}

.actions {
  text-align: center;
}

.refresh-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.refresh-btn:hover {
  background-color: #45a049;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.pagination-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.pagination-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-info {
  font-weight: bold;
  color: #333;
  min-width: 100px;
  text-align: center;
}

@media (max-width: 768px) {
  .todo-container {
    padding: 1rem;
  }
  
  .todo-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .pagination-btn {
    width: 100%;
  }
}
</style>
